<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { createUser } from '$lib/services/users';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let error = '';
	let success = '';

	async function register() {
		error = '';
		success = '';

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		const { data, error: signUpError } = await auth.signUp(email, password);

		if (signUpError) {
			error = signUpError.message;
			return;
		}

		try {
			const userId = data?.user?.id;

			if (!userId) {
				throw new Error('User ID missing after registration.');
			}

			await createUser(userId, username);
			success = 'Registration successful! Please check your email to confirm your account.';
			setTimeout(() => goto(resolve('/login')), 2000);
		} catch (err) {
			error = (err as Error).message;
		}
	}
</script>

<h1>Register</h1>
<span>Already have an account?</span> <a href={resolve('/login')}>Log in</a>.

<form on:submit|preventDefault={register}>
	<input type="text" placeholder="Username" bind:value={username} required />
	<input type="email" placeholder="Email" bind:value={email} required />
	<input type="password" placeholder="Password" bind:value={password} required />
	<input type="password" placeholder="Confirm Password" bind:value={confirmPassword} required />
	<button type="submit">Register</button>
</form>

{#if error}
	<p style="color:red">{error}</p>
{/if}

{#if success}
	<p style="color:green">{success}</p>
{/if}
