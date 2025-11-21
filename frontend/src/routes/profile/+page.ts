import type { PageLoad } from './$types';
import { loadUser } from '$lib/services/users';

export const load: PageLoad = async () => {
	return loadUser();
};
