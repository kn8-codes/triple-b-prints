import type { Handle } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const offlineApiResponse = {
	ok: false,
	status: 'offline',
	message: 'Triple B Prints is temporarily offline. Website requests and orders are not being accepted right now.'
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/')) {
		return json(offlineApiResponse, { status: 503 });
	}

	return resolve(event);
};
