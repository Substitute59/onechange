<script lang="ts">
  import { auth } from '$lib/stores/auth';

  let email = '';
  let message = '';
  let error = '';

  async function submit() {
    message = '';
    error = '';

    const { error: err } = await auth.forgotPassword(email);

    if (err) {
      error = err.message;
    } else {
      message = 'Si ce mail existe, un lien de réinitialisation a été envoyé.';
      email = '';
    }
  }
</script>

<h1>Mot de passe oublié</h1>

<form on:submit|preventDefault={submit}>
  <input type="email" bind:value={email} placeholder="Votre email" required />
  <button type="submit">Envoyer le lien</button>
</form>

{#if message}<p style="color: green">{message}</p>{/if}
{#if error}<p style="color: red">{error}</p>{/if}
