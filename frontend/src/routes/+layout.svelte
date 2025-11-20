<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import type { User } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let user: User | null = null;
  let isAuthenticated = false;
  let loading = true;

  const unsubscribe = auth.subscribe(state => {
    user = state.user;
    isAuthenticated = state.isAuthenticated;
    loading = state.loading;
  });

  onMount(async () => {
    if (window.location.pathname === '/reset-password') {
      return;
    }
    await auth.fetchUser();
    auth.subscribeToAuthChanges();
  });

  onDestroy(() => unsubscribe());

  async function logout() {
    await auth.signOut();
    goto('/login');
  }
</script>

{#if loading}
  <span>Loading...</span>
{:else}
  <header>
    <nav>
      {#if isAuthenticated}
        <span>Hi, {user?.username || user?.email}!</span>
        <a href="/users/{user?.id}">Mon profil</a>
        <button on:click={logout}>Logout</button>
      {:else}
        <a href="/login">Login</a>
      {/if}
    </nav>
  </header>

  <main>
    <slot />
  </main>
{/if}
