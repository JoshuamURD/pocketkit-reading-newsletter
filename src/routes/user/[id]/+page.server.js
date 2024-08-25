import { error, fail } from '@sveltejs/kit';
import { validatePassword } from '$lib/utils';
export async function load({ locals }) {
    const { user, pb } = locals;
  
    if (!user) {
      throw error(401, 'Unauthorized');
    }
  
    try {
      const assignedBooks = await pb.collection('user_books').getList(1, 50, {
        filter: `users="${user.id}"`,
        expand: 'books'
      });
  
      return { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email
          // Add other non-sensitive user data as needed
        },
        assignedBooks: assignedBooks.items
      };
    } catch (err) {
      console.error('Error fetching assigned books:', err);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        assignedBooks: []
      };
    }
}
  

export const actions = {
  updateProfile: async ({ request, locals }) => {
    const { user, pb } = locals;
    const data = await request.formData();

    const name = data.get('name');
    const email = data.get('email');
    const currentPassword = data.get('currentPassword');
    const newPassword = data.get('newPassword');
    const confirmPassword = data.get('confirmPassword');

    // Validate current password
    try {
      await pb.collection('users').authWithPassword(user.email, currentPassword);
    } catch (err) {
      console.error('Error authenticating user:', err);
      return fail(400, { error: 'Current password is incorrect' });
    }

    const updates = {};

    // Update name if changed
    if (name !== user.name) {
      updates.name = name;
    }

    // Update email if changed
    if (email !== user.email) {
      updates.email = email;
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return fail(400, { error: 'New passwords do not match' });
      }

      if (!validatePassword(newPassword)) {
        return fail(400, { error: 'Password does not meet security requirements' });
      }

      updates.password = newPassword;
      updates.passwordConfirm = confirmPassword;
    }

    try {
      await pb.collection('users').update(user.id, updates);
      return { success: true };
    } catch (err) {
      console.error('Error updating user profile:', err);
      return fail(500, { error: 'Failed to update profile' });
    }
  }
};