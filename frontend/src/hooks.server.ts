import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('sb-access-token'); // ou récupérer le JWT d'une autre manière
	event.locals.user = null;

	if (session) {
		const { data } = await supabase.auth.getUser(session);
		if (data.user) event.locals.user = data.user;
	}

	return resolve(event);
};
