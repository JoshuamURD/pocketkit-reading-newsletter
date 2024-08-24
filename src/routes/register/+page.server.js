// src/routes/register/+page.server.js
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    const name = data.get('name');

    if (!email || !password || !name) {
      return fail(400, { message: 'Missing required fields' });
    }
    try {
      const user = await locals.pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
      });
      
      // Send a verification email
      await locals.pb.collection('users').requestVerification(email);

      // Redirect to login page or dashboard
      throw redirect(303, '/login');
    } catch (err) {
      let emailUsed = err.originalError?.data?.data?.email?.message;
      if (emailUsed) {
        console.error('Email already in use:', emailUsed);
        return fail(400, { message: emailUsed });
      } else {
        console.error('Registration error:', err);
        return fail(500, { message: 'An error occurred during registration' });
      }
    }
  },
};