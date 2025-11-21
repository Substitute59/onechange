import { updateUser } from '$lib/services/users';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const id = locals.user?.id;
		if (!id) return { error: 'Utilisateur non connecté' };

		const resp = await updateUser(id, data);

		if (resp.error) {
			return { error: resp.error || 'Erreur lors de la mise à jour' };
		}

		return { success: true };
	}
};
