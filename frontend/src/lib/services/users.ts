import { PUBLIC_BACK_URL } from '$env/static/public';
import { csrfStore } from '$lib/stores/csrf';

export async function createUser(id: string, username: string) {
	const csrfToken = await csrfStore.get();

	const res = await fetch(PUBLIC_BACK_URL + 'api/users/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken || ''
		},
		body: JSON.stringify({ id, username }),
		credentials: 'include'
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error('User creation failed: ' + text);
	}

	return res.json();
}
