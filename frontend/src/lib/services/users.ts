import { PUBLIC_BACK_URL } from '$env/static/public';
import { csrfStore } from '$lib/stores/csrf';
import { auth, type User } from '$lib/stores/auth';

export interface UserResult {
	user: User | null;
	error?: string;
}

export async function createUser(data: FormData): Promise<UserResult> {
	const csrfToken = await csrfStore.get();

	try {
		const res = await fetch(PUBLIC_BACK_URL + 'api/users/', {
			method: 'POST',
			headers: { 'X-CSRFToken': csrfToken || '' },
			body: data,
			credentials: 'include'
		});

		const result = await res.json();

		if (!res.ok) {
			const msg = result.error || 'Failed to create user';
			throw new Error(msg);
		}

		return result;
	} catch (err) {
		return { user: null, error: err instanceof Error ? err.message : String(err) };
	}
}

export async function loadUser(): Promise<UserResult> {
	const { user, isAuthenticated } = auth.getState();

	if (!isAuthenticated || !user) {
		return { user: null, error: 'Non connecté' };
	}

	try {
		const res = await fetch(`${PUBLIC_BACK_URL}api/users/${user.id}/`);

		const result = await res.json();

		if (!res.ok) {
			const msg = result.error || 'Failed to fetch user';
			throw new Error(msg);
		}

		return result;
	} catch (err) {
		return { user: null, error: err instanceof Error ? err.message : String(err) };
	}
}

export async function updateUser(userId: string, data: FormData): Promise<UserResult> {
	if (!userId) {
		return { user: null, error: 'User id manquant' };
	}

	const csrfToken = await csrfStore.get();

	try {
		const res = await fetch(`${PUBLIC_BACK_URL}api/users/${userId}/update/`, {
			method: 'POST',
			headers: { 'X-CSRFToken': csrfToken || '' },
			body: data,
			credentials: 'include'
		});

		const result = await res.json();

		if (!res.ok) {
			const msg = result.error || 'Failed to update user';
			throw new Error(msg);
		}

		return result;
	} catch (err) {
		return { user: null, error: err instanceof Error ? err.message : String(err) };
	}
}
