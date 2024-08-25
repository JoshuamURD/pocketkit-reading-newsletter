import { error } from '@sveltejs/kit';

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
    }
};