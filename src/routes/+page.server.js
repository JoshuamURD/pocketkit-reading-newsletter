import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if (!locals.user) {
        console.log('Redirecting to login')
        throw redirect(308, '/login'); 
    }
    try {
      const books = await locals.pb.collection('books').getFullList({
        sort: '-created',
      });
      return { books };
    } catch (error) {
      console.error('Error fetching books:', error);
      return { books: [] };
    }
  }