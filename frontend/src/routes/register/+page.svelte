<script lang="ts">
  import { auth } from '../../lib/stores/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let success = '';

  async function register() {
    const result = await auth.register(email, password);

    if (result.success) {
      success = result.message;
      setTimeout(() => goto('/login'), 1000);
    } else {
      error = result.message;
    }
  }
</script>

<div>
	<h2>Register</h2>
	<form on:submit|preventDefault={register}>
		<div>
			<label for="email">Email:</label>
			<input
				bind:value={email}
				id="email"
				type="email"
				required
			/>
		</div>

		<div>
			<label for="password">Password:</label>
			<input
				bind:value={password}
				id="password"
				type="password"
				required
			/>
		</div>

		<button type="submit">Register</button>
	</form>

	{#if error}
		<p>{error}</p>
	{/if}

	{#if success}
		<p>{success}</p>
	{/if}
</div>
