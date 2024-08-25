import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
    // Clear the session
    locals.pb.authStore.clear();

    // Redirect to the login page
    throw redirect(303, '/login');
};