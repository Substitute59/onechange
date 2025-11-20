<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let newPassword = '';
  let message = '';
  let error = '';

  let accessToken = '';

  onMount(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.slice(1));
      accessToken = params.get('access_token') || '';
    }
    if ($auth.isAuthenticated || !accessToken) {
        goto('/');
    }
  });

  async function submit() {
    const { error: err } = await auth.resetPassword(newPassword);

    if (err) {
      error = err.message;
    } else {
      message = 'Mot de passe réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion.';
      newPassword = '';
      setTimeout(() => goto('/login'), 2000);
    }
  }
</script>

<h1>Créer un nouveau mot de passe</h1>

<form on:submit|preventDefault={submit}>
  <input type="password" bind:value={newPassword} placeholder="Nouveau mot de passe" required />
  <button type="submit">Réinitialiser</button>
</form>

{#if message}<p style="color: green">{message}</p>{/if}
{#if error}<p style="color: red">{error}</p>{/if}
