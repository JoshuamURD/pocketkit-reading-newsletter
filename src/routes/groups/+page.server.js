// routes/groups/server/js
import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/utils';

export const load = async ({ locals }) => {
    // Check if the user is authenticated
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, '/login');
    }

    try {
        const groups = await locals.pb.collection('groups').getFullList({
            sort: '-created',
            expand: 'Book,Users,Posts'
        });

        // console.log('Fetched groups:', groups); // For debugging

        return {
            groups: serializeNonPOJOs(groups)
        };
    } catch (err) {
        console.error('Error:', err);
        throw error(err.status, err.message);
    }
};