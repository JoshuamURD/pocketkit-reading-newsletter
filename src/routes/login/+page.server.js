// src/routes/login/+page.server.js

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, locals }) => {
      const data = await request.formData();
      const email = data.get('email');
      const password = data.get('password');
  
      try {
        await locals.pb.collection('users').authWithPassword(email, password);
        // After successful login, the hook will automatically set the auth cookie
        return { success: true };
      } catch (err) {
        console.error("Login failed", err);
        return { 
          success: false, 
          error: "Your login failed! " + err.message
        };
      }
    }
  };