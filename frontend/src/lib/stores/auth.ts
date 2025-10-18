import { writable } from 'svelte/store';
import { PUBLIC_BACK_URL } from '$env/static/public';

/* ========= Interfaces ========= */
export interface User {
  id?: number;
  email?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

/* ========= Load State from localStorage ========= */
const storedState = typeof localStorage !== 'undefined'
  ? localStorage.getItem('authState')
  : null;

const initialState: AuthState = storedState
  ? JSON.parse(storedState)
  : { user: null, isAuthenticated: false };

/* ========= Create Store ========= */
function createAuthStore() {
  const { subscribe, update, set } = writable<AuthState>(initialState);

  return {
    subscribe,

    /* --------- Get CSRF cookie --------- */
    async setCsrfToken() {
      try {
        await fetch(`${PUBLIC_BACK_URL}api/set-csrf-token/`, {
          method: 'GET',
          credentials: 'include'
        });
      } catch (err) {
        console.error('Failed to set CSRF token', err);
      }
    },

    /* --------- Login --------- */
    async login(email: string, password: string) {
      await this.setCsrfToken();
      const csrfToken = getCSRFToken();

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (csrfToken) headers['X-CSRFToken'] = csrfToken;

      const response = await fetch(`${PUBLIC_BACK_URL}api/login/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
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

    /* --------- Register --------- */
    async register(email: string, password: string): Promise<{ success: boolean; message: string }> {
      try {
        await this.setCsrfToken();
        const csrfToken = getCSRFToken();

        const response = await fetch(PUBLIC_BACK_URL + 'api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || ''
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, message: 'Registration successful! Please login.' };
        } else {
          return { success: false, message: data.error || 'Registration failed' };
        }
      } catch (error) {
        return { success: false, message: 'An error occurred during registration. ' + error };
      }
    },

    /* --------- Logout --------- */
    async logout() {
      await this.setCsrfToken();
      const csrfToken = getCSRFToken();
      const headers: Record<string, string> = {};
      if (csrfToken) headers['X-CSRFToken'] = csrfToken;

      const response = await fetch(`${PUBLIC_BACK_URL}api/logout/`, {
        method: 'POST',
        headers,
        credentials: 'include'
      });

      if (response.ok) {
        const resetState = { user: null, isAuthenticated: false };
        set(resetState);
        saveState(resetState);
      }
    },

    /* --------- Fetch Current User --------- */
    async fetchUser() {
      try {
        const response = await fetch(`${PUBLIC_BACK_URL}api/user/`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data: User = await response.json();
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
      } catch (err) {
        console.error('Failed to fetch user', err);
        update(state => {
          state.user = null;
          state.isAuthenticated = false;
          saveState(state);
          return state;
        });
      }
    }
  };
}

/* ========= LocalStorage Persistence ========= */
function saveState(state: AuthState) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('authState', JSON.stringify(state));
  }
}

/* ========= CSRF Helper ========= */
export function getCSRFToken(): string | null {
  const name = 'csrftoken';
  let cookieValue: string | null = null;

  if (typeof document !== 'undefined' && document.cookie) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const auth = createAuthStore();
