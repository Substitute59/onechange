import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { PUBLIC_BACK_URL } from '$env/static/public';

export interface User {
	id: string;
	email?: string;
	username?: string;
	avatar_url?: string;
	bio?: string;
	city?: string;
	age?: number;
	avatarFile?: FileList;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
}

const storedState: AuthState =
	typeof window !== 'undefined' && localStorage.getItem('authState')
		? JSON.parse(localStorage.getItem('authState')!)
		: { user: null, isAuthenticated: false, loading: true };

const CHECK_EMAIL_URL = PUBLIC_BACK_URL + 'api/users/check-email/';

async function checkEmail(email: string) {
	try {
		const res = await fetch(`${CHECK_EMAIL_URL}?email=${email}`);
		if (!res.ok) return { exists: false };
		return await res.json();
	} catch {
		return { exists: false };
	}
}

function createAuthStore() {
	const { subscribe, update, set } = writable<AuthState>(storedState);

	function saveState(state: AuthState) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('authState', JSON.stringify(state));
		}
	}

	return {
		subscribe,

		async signUp(email: string, password: string) {
			const check = await checkEmail(email);

			if (check.exists) {
				if (check.provider === 'email') {
					return { data: null, error: new Error('Email déjà utilisé') };
				} else {
					return {
						data: null,
						error: new Error(
							`Email déjà utilisé avec ${check.provider}, veuillez utiliser ce provider`
						)
					};
				}
			}

			const { data, error } = await supabase.auth.signUp({ email, password });
			if (data?.user) {
				update(() => {
					const state = { user: data.user as User, isAuthenticated: false, loading: false };
					saveState(state);
					return state;
				});
			}
			return { data, error };
		},

		async signIn(email: string, password: string) {
			const check = await checkEmail(email);

			if (check.exists && check.provider !== 'email') {
				return {
					data: null,
					error: new Error(`Un compte existe avec ${check.provider}, veuillez utiliser ce provider`)
				};
			}

			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (data?.user) {
				update(() => {
					const state = { user: data.user as User, isAuthenticated: true, loading: false };
					saveState(state);
					return state;
				});
			}
			return { data, error };
		},

		async signInWithGoogle() {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: window.location.origin + '/login/callback'
				}
			});

			return { data, error };
		},

		async signOut() {
			const { error } = await supabase.auth.signOut();
			const state = { user: null, isAuthenticated: false, loading: false };
			set(state);
			saveState(state);
			return { error };
		},

		async fetchUser() {
			update((state) => ({ ...state, loading: true }));
			const { data } = await supabase.auth.getUser();
			if (data?.user) {
				update(() => {
					const state = { user: data.user as User, isAuthenticated: true, loading: false };
					saveState(state);
					return state;
				});
			} else {
				const state = { user: null, isAuthenticated: false, loading: false };
				set(state);
				saveState(state);
			}
		},

		async forgotPassword(email: string) {
			try {
				const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: window.location.origin + '/reset-password'
				});
				return { data, error };
			} catch (err: unknown) {
				return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
			}
		},

		async resetPassword(newPassword: string) {
			try {
				const { data, error } = await supabase.auth.updateUser({
					password: newPassword
				});
				return { data, error };
			} catch (err: unknown) {
				return { error: err instanceof Error ? err : new Error(String(err)) };
			}
		},

		subscribeToAuthChanges() {
			supabase.auth.onAuthStateChange((_event, session) => {
				update((state) => ({ ...state, loading: true }));

				if (session?.user) {
					const newState = { user: session.user as User, isAuthenticated: true, loading: false };
					update(() => {
						saveState(newState);
						return newState;
					});
				} else {
					const newState = { user: null, isAuthenticated: false, loading: false };
					update(() => {
						saveState(newState);
						return newState;
					});
				}
			});
		},

		getState(): AuthState {
			let state: AuthState;
			auth.subscribe((s) => (state = s))();
			return state!;
		}
	};
}

export const auth = createAuthStore();
