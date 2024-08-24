import PocketBase from 'pocketbase';
import { EMAIL, PASSWORD } from "$env/static/private";

//A function to get the URL of the cover image of the book to store in the pocketbase
async function fetchBookCoverUrl(author, bookName) {
  const query = `${bookName} ${author}`.replace(/ /g, '+');
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    //console.log("API response:", data); // Log the entire response for debugging

    if (data.items && data.items.length > 0) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      const coverUrl = imageLinks ? imageLinks.thumbnail : null;
      //console.log("Fetched cover URL:", coverUrl);
      return coverUrl;
    } else {
      console.log("No books found for the given query");
      return null;
    }
  } catch (error) {
    console.error("Error fetching book cover:", error);
    return null;
  }
}

// Handle the form POST action "create" which is activated on submitting book
export const actions = {
  create: async ({ request }) => {
    const pb = new PocketBase("http://127.0.0.1:8090");
    await pb.admins.authWithPassword(EMAIL, PASSWORD);

    const form = await request.formData();
    const author = form.get("author") ?? "";
    const bookName = form.get("bookName") ?? "";
    const pdf_file = form.get("pdf_file");

    if (!pdf_file) {
      return { success: false, error: "No PDF file uploaded" };
    }

    const coverImageUrl = await fetchBookCoverUrl(author, bookName);

    try {
      const record = await pb.collection('books').create({
        author,
        book_name: bookName,  // Changed from bookName to book_name
        cover_url: coverImageUrl,
        pdf_file: pdf_file
      }, {
        filename: pdf_file.name
      });

      return { success: true, record };
    } catch (error) {
      console.error("Error creating record:", error);
      console.error("Detailed error data:", JSON.stringify(error.response?.data, null, 2));
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data
      };
    }
  }
};