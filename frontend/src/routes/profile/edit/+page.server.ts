import { PUBLIC_BACK_URL } from '$env/static/public';
import type { Actions } from './$types';
import { csrfStore } from '$lib/stores/csrf';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const id = locals.user?.id;
		if (!id) return { error: 'Utilisateur non connecté' };

		const body = {
			username: data.get('username'),
			avatar_url: data.get('avatar_url'),
			bio: data.get('bio'),
			age: data.get('age'),
			city: data.get('city')
		};

		const csrfToken = await csrfStore.get();

		const res = await fetch(`${PUBLIC_BACK_URL}api/users/${id}/update/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken || ''
			},
			body: JSON.stringify(body),
			credentials: 'include'
		});

		if (!res.ok) {
			const resp = await res.json();
			return { error: resp.error || 'Erreur lors de la mise à jour' };
		}

		return { success: true };
	}
};
