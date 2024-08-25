// src/routes/+layout.server.js
import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
  if (!locals.user && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
    throw redirect(303, '/login');
  }
  return {
    user: locals.user
  };
}