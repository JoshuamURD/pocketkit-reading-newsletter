import PocketBase from 'pocketbase';
/** @type {import('@sveltejs/kit').Handle} */

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase("http://127.0.0.1:8090");
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	} catch (__error) {
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);
	const expires = new Date();

	// Set expiration time on the cookie
	expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 7);

	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ secure: false, expires, sameSite: 'none' })
	);

	return response;
};