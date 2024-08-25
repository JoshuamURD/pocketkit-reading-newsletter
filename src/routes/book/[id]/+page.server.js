import { error } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS, GEMINI_API_KEY } from '$env/static/private';
import { PDFExtract } from 'pdf.js-extract';
import { PDFDocument } from 'pdf-lib';

const pdfExtract = new PDFExtract();



export async function load({ params, locals }) {
    const { id } = params;
    const { pb, user } = locals;

    try {
        // Fetch the book
        const book = await pb.collection('books').getOne(id);

        // Fetch all user assignments for this book
        const userBooks = await pb.collection('user_books').getList(1, 50, {
            filter: `books="${id}"`,
            expand: 'users'
        });

        // Check if the current user has assigned this book
        let currentUserBook = null;
        if (user) {
            currentUserBook = userBooks.items.find(ub => ub.expand.users.id === user.id);
        }

        return {
            book,
            userBooks: userBooks.items,
            currentUserBook
        };
    } catch (err) {
        console.error('Error fetching book data:', err);
        throw error(404, 'Book not found or error fetching data');
    }
}

export const actions = {
    assign: async ({ request, locals }) => {
        const data = await request.formData();
        const bookId = data.get('bookId');
        const startPage = data.get('startPage');
        const endPage = data.get('endPage');

        try {
            await locals.pb.collection('user_books').create({
                users: locals.user.id,
                books: bookId,
                start_page: parseInt(startPage),
                end_page: parseInt(endPage)
            });
            return { success: true };
        } catch (err) {
            console.error('Error assigning book:', err);
            return { success: false, error: err.message };
        }
    },

    unassign: async ({ request, locals }) => {
        const data = await request.formData();
        const userBookId = data.get('userBookId');

        try {
            await locals.pb.collection('user_books').delete(userBookId);
            return { success: true };
        } catch (err) {
            console.error('Error unassigning book:', err);
            return { success: false, error: err.message };
        }
    },
 
    sendEmail: async ({ request, locals, fetch }) => {
        const data = await request.formData();
        const userBookId = data.get('userBookId');

        try {
            // 1. Fetch user_book record
            const userBook = await locals.pb.collection('user_books').getOne(userBookId, {
                expand: 'users,books'
            });

            // 2. Extract PDF content
            const pdfUrl = userBook.expand.books.pdf_file;
            let pdfBuffer;
            
            if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
                const pdfResponse = await fetch(pdfUrl);
                pdfBuffer = await pdfResponse.arrayBuffer();
            } else {
                const fullPdfUrl = `${locals.pb.baseUrl}/api/files/${userBook.expand.books.collectionId}/${userBook.expand.books.id}/${encodeURIComponent(pdfUrl)}?token=${locals.pb.authStore.token}`;
                console.log("URL of PDF: ", fullPdfUrl);
                const pdfResponse = await fetch(fullPdfUrl);
                pdfBuffer = await pdfResponse.arrayBuffer();
            }

            const pdfData = await pdfExtract.extractBuffer(pdfBuffer);

            const totalPages = pdfData.pages.length;
            const startPage = Math.max(1, userBook.start_page);
            const endPage = Math.min(userBook.end_page, totalPages);
            
            console.log(`Extracting pages ${startPage} to ${endPage} out of ${totalPages} total pages`);

            // Extract content from the specified page range
            const pageContent = pdfData.pages
                .slice(startPage - 1, endPage)
                .map(page => page.content.map(item => item.str).join(' '))
                .join('\n');

            // Create a new PDF with extracted pages
            const newPdfDoc = await PDFDocument.create();
            const originalPdfDoc = await PDFDocument.load(pdfBuffer);
            
            for (let i = startPage - 1; i < endPage; i++) {
                const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [i]);
                newPdfDoc.addPage(copiedPage);
                console.log(`Copied page ${i + 1}`);
            }

            console.log(`New PDF has ${newPdfDoc.getPageCount()} pages`);

            const pdfBytes = await newPdfDoc.save();
            const pdfAttachment = Buffer.from(pdfBytes);

            // 3. Generate questions using Gemini AI
            const questions = await generateQuestions(pageContent);

            // 4. Send email with PDF attachment
            await sendEmailWithQuestions(userBook.expand.users.email, questions, userBook.expand.books.book_name, pdfAttachment);

            // 5. Update page range
            const newStartPage = endPage + 1;
            const newEndPage = Math.min(endPage + (endPage - startPage + 1), totalPages);
            await locals.pb.collection('user_books').update(userBookId, {
                start_page: newStartPage,
                end_page: newEndPage,
                email_sent: new Date().toISOString()
            });

            return { success: true };
        } catch (err) {
            console.error('Error sending email:', err);
            throw error(500, { message: 'Error sending email', details: err.message });
        }
    }
};

async function generateQuestions(content) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Please analyze the pages of the provided PDF document and generate a series of thought-provoking questions that would encourage deep discussion and critical thinking about the text. Focus on the following aspects:

1. Key Themes and Ideas: What are the main themes or arguments presented in the document? How are these ideas supported or challenged within the text?
   
2. Author’s Perspective: What is the author's viewpoint or stance on the subject matter? How does the author’s perspective influence the presentation of information?

3. Evidence and Examples: What evidence or examples are used to substantiate the key points? Are there any notable gaps or areas that could benefit from further elaboration?

4. Implications and Impact: What are the potential implications or consequences of the ideas presented? How might they affect current thinking or practices in the relevant field?

5. Connections and Comparisons: How do the concepts in the text relate to other known theories, works, or real-world situations? Are there any interesting contrasts or parallels?

Generate questions that will help in reconstructing the ideas, exploring their significance, and fostering a comprehensive understanding of the material.
:\n\n${content.substring(0, 1000)}`
                }]
            }]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate questions: ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function sendEmailWithQuestions(toEmail, questions, bookName, pdfAttachment) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    });

    const mailOptions = {
        from: GMAIL_USER,
        to: toEmail,
        subject: `Questions for your assigned book: ${bookName}`,
        text: `Here are your questions for the assigned pages of ${bookName}:\n\n${questions}`,
        attachments: [
            {
                filename: `${bookName}_extract.pdf`,
                content: pdfAttachment,
                contentType: 'application/pdf'
            }
        ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
}