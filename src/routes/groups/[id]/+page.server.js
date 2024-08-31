import { error, fail } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/utils';

export async function load({ locals, params }) {
  const { id } = params;
  try {
    const group = await locals.pb.collection("groups").getOne(id, {
      expand: 'Book,Users,Posts'
    });
    const user = locals.pb.authStore.model;
    return { 
      group: serializeNonPOJOs(group),
      user: serializeNonPOJOs(user)
    };
  } catch (err) {
    console.error('Error fetching group:', err);
    throw error(500, 'Error fetching group data');
  }
}

export const actions = {
  likePost: async ({ request, locals }) => {
    const data = await request.formData();
    const postId = data.get('postId');
    const userId = locals.pb.authStore.model.id;

    if (!postId) {
      return fail(400, { message: 'Post ID is required' });
    }

    try {
      // Get the current post
      const post = await locals.pb.collection('group_posts').getOne(postId);

      // Check if the user has already liked the post
      const likedBy = post.likedBy || [];
      if (likedBy.includes(userId)) {
        return fail(400, { message: 'You have already liked this post' });
      }

      // Update the post: increment likes and add user to likedBy
      await locals.pb.collection('group_posts').update(postId, {
        likes: (post.likes || 0) + 1,
        likedBy: [...likedBy, userId]
      });

      return { success: true };
    } catch (err) {
      console.error('Error liking post:', err);
      return fail(500, { message: 'Failed to like post' });
    }
  }
};