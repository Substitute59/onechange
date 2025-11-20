import type { PageLoad } from './$types';
import { loadProfile } from '$lib/profile';

export const load: PageLoad = async ({ fetch }) => {
	return loadProfile(fetch);
};
