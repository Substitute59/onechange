import { writable } from 'svelte/store';

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

/* ========= Crée le store ========= */
function createAuthStore() {
  const { subscribe, update, set } = writable<AuthState>(initialState);

  return {
    subscribe,

    async setCsrfToken() {
      await fetch('http://localhost:8000/api/set-csrf-token', {
        method: 'GET',
        credentials: 'include'
      });
    },

    async login(email: string, password: string) {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      update((state) => {
        if (data.success) {
          state.isAuthenticated = true;
          state.user = data.user || null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        saveState(state);
        return state;
      });
    },

    async logout() {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCSRFToken()
        },
        credentials: 'include'
      });

      if (response.ok) {
        const resetState = { user: null, isAuthenticated: false };
        set(resetState);
        saveState(resetState);
      }
    },

    async fetchUser() {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
          }
        });

        if (response.ok) {
          const data: User = await response.json();
          update((state) => {
            state.user = data;
            state.isAuthenticated = true;
            saveState(state);
            return state;
          });
        } else {
          update((state) => {
            state.user = null;
            state.isAuthenticated = false;
            saveState(state);
            return state;
          });
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        update((state) => {
          state.user = null;
          state.isAuthenticated = false;
          saveState(state);
          return state;
        });
      }
    }
  };
}

/* ========= Persistance LocalStorage ========= */
function saveState(state: AuthState) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('authState', JSON.stringify(state));
  }
}

/* ========= CSRF ========= */
export function getCSRFToken(): string {
  const name = 'csrftoken';
  let cookieValue: string | null = null;

  if (typeof document !== 'undefined' && document.cookie) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  if (!cookieValue) throw new Error('Missing CSRF cookie.');
  return cookieValue;
}

export const auth = createAuthStore();
