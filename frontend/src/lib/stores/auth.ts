import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { PUBLIC_BACK_URL } from '$env/static/public';

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  city?: string;
  age?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const storedState: AuthState = typeof localStorage !== 'undefined' && localStorage.getItem('authState')
  ? JSON.parse(localStorage.getItem('authState')!)
  : { user: null, isAuthenticated: false };

const CHECK_EMAIL_URL = PUBLIC_BACK_URL + 'api/users/check-email/';

async function checkEmail(email: string) {
  const res = await fetch(`${CHECK_EMAIL_URL}?email=${email}`);
  const data = await res.json();
  return data;
}

function createAuthStore() {
  const { subscribe, update, set } = writable<AuthState>(storedState);

  function saveState(state: AuthState) {
    if (typeof localStorage !== 'undefined') {
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
          return { data: null, error: new Error(`Email déjà utilisé avec ${check.provider}, veuillez utiliser ce provider`) };
        }
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (data?.user) {
        update(() => {
          const state = { user: data.user as User, isAuthenticated: true };
          saveState(state);
          return state;
        });
      }
      return { data, error };
    },

    async signIn(email: string, password: string) {
      const check = await checkEmail(email);

      if (check.exists && check.provider !== 'email') {
        return { data: null, error: new Error(`Un compte existe avec ${check.provider}, veuillez utiliser ce provider`) };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.user) {
        update(() => {
          const state = { user: data.user as User, isAuthenticated: true };
          saveState(state);
          return state;
        });
      }
      return { data, error };
    },

    async signInWithGoogle() {
      // Lance Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      return { data, error };
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
      saveState({ user: null, isAuthenticated: false });
      return { error };
    },

    async fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        update(() => {
          const state = { user: data.user as User, isAuthenticated: true };
          saveState(state);
          return state;
        });
      } else {
        set({ user: null, isAuthenticated: false });
        saveState({ user: null, isAuthenticated: false });
      }
    },

    subscribeToAuthChanges() {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          update(() => {
            const state = { user: session.user as User, isAuthenticated: true };
            saveState(state);
            return state;
          });
        } else {
          set({ user: null, isAuthenticated: false });
          saveState({ user: null, isAuthenticated: false });
        }
      });
    }
  };
}

export const auth = createAuthStore();
