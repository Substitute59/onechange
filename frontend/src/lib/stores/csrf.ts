// src/lib/stores/csrf.ts
import { writable } from 'svelte/store';
import { PUBLIC_BACK_URL } from '$env/static/public';

function createCsrfStore() {
  const { subscribe, set } = writable<string | null>(null);

  return {
    subscribe,
    async fetch() {
      const res = await fetch(`${PUBLIC_BACK_URL}api/set-csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      set(data.csrfToken);
      return data.csrfToken;
    },
    async get() {
      let token: string | null = null;
      subscribe(value => { token = value; })();
      
      if (!token) {
        token = await this.fetch();
      }
      return token;
    }
  };
}

export const csrfStore = createCsrfStore();
