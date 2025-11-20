import { PUBLIC_BACK_URL } from '$env/static/public';
import { auth, type User } from './stores/auth';

export interface ProfileLoadResult {
	user: User | null;
	error?: string;
}

export async function loadProfile(fetchFn: typeof fetch): Promise<ProfileLoadResult> {
	const { user, isAuthenticated } = auth.getState();

	if (!isAuthenticated || !user) {
		return { user: null, error: 'Non connecté' };
	}

	try {
		const res = await fetchFn(`${PUBLIC_BACK_URL}api/users/${user.id}/`);
		if (!res.ok) throw new Error('Failed to fetch user');
		const result = await res.json();
		return result;
	} catch (err) {
		return { user: null, error: err instanceof Error ? err.message : String(err) };
	}
}
