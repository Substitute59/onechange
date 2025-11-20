<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import type { User } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let user: User | null = null;
  let isAuthenticated = false;

  // abonnement au store
  const unsubscribe = auth.subscribe(state => {
    user = state.user;
    isAuthenticated = state.isAuthenticated;
  });

  onMount(async () => {
    // récupérer l'utilisateur au chargement
    await auth.fetchUser();
    // écouter les changements de session (connexion / déconnexion)
    auth.subscribeToAuthChanges();
  });

  onDestroy(() => unsubscribe());

  async function logout() {
    await auth.signOut();
    goto('/login');
  }
</script>

<header>
  <nav>
    {#if isAuthenticated}
      <span>Hi, {user?.username}!</span>
      <a href="/profile">Mon profil</a>
      <button on:click={logout}>Logout</button>
    {:else}
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    {/if}
  </nav>
</header>

<main>
  <slot /> <!-- le contenu de chaque page s'affiche ici -->
</main>
