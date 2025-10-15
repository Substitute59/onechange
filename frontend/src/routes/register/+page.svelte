<script lang="ts">
	import { getCSRFToken } from '../../lib/stores/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let success = '';

	async function register() {
		error = '';
		success = '';

		try {
			const response = await fetch('http://localhost:8000/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': getCSRFToken()
				},
				body: JSON.stringify({
					email,
					password
				}),
				credentials: 'include'
			});

			const data = await response.json();

			if (response.ok) {
				success = 'Registration successful! Please log in.';
				setTimeout(() => {
					goto('/login');
				}, 1000);
			} else {
				error = data.error || 'Registration failed';
			}
		} catch (err) {
			error = 'An error occurred during registration: ' + err;
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
