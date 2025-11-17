import { writable } from 'svelte/store';
import { PUBLIC_BACK_URL } from '$env/static/public';
import { csrfStore } from './csrf';

export interface User {
  id?: number;
  email?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const storedState = typeof localStorage !== 'undefined'
  ? localStorage.getItem('authState')
  : null;

const initialState: AuthState = storedState
  ? JSON.parse(storedState)
  : { user: null, isAuthenticated: false };

function createAuthStore() {
  const { subscribe, update, set } = writable<AuthState>(initialState);

  return {
    subscribe,

    async login(username: string, password: string) {
      const csrfToken = await csrfStore.get();
      const res = await fetch(`${PUBLIC_BACK_URL}api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await res.json();
      update(state => {
        if (data.success) {
          state.isAuthenticated = true;
          state.user = data.user || null;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
        saveState(state);
        return state;
      });
    },

    async register(username: string, email: string, password: string) {
      const csrfToken = await csrfStore.get();
      const res = await fetch(`${PUBLIC_BACK_URL}api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) return { success: true, message: 'Registration successful!' };
      return { success: false, message: data.error || 'Registration failed' };
    },

    async logout() {
      const csrfToken = await csrfStore.get();
      await fetch(`${PUBLIC_BACK_URL}api/logout`, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrfToken || '' },
        credentials: 'include',
      });

      const resetState = { user: null, isAuthenticated: false };
      set(resetState);
      saveState(resetState);
    },

    async fetchUser() {
      const res = await fetch(`${PUBLIC_BACK_URL}api/user`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data: User = await res.json();
        update(state => {
          state.user = data;
          state.isAuthenticated = true;
          saveState(state);
          return state;
        });
      } else {
        update(state => {
          state.user = null;
          state.isAuthenticated = false;
          saveState(state);
          return state;
        });
      }
    },
  };
}

function saveState(state: AuthState) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('authState', JSON.stringify(state));
  }
}

export const auth = createAuthStore();
