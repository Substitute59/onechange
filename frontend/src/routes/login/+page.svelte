<script lang="ts">
	import { auth } from '../../lib/stores/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';

	async function login() {
		try {
			await auth.login(email, password);
			if ($auth.isAuthenticated) {
				goto('/');
			} else {
				error = 'Login failed. Please check your credentials.';
			}
		} catch (err) {
			error = 'Login failed. Please try again.';
		}
	}

	function resetError() {
		error = '';
	}
</script>

<div class="login">
	<h1>Login</h1>

	<form on:submit|preventDefault={login}>
		<div>
			<label for="email">Email:</label>
			<input
				bind:value={email}
				id="email"
				type="text"
				required
				on:input={resetError}
			/>
		</div>

		<div>
			<label for="password">Password:</label>
			<input
				bind:value={password}
				id="password"
				type="password"
				required
				on:input={resetError}
			/>
		</div>

		<button type="submit">Login</button>
	</form>

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>
