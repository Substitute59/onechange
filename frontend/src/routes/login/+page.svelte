<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';

	async function login() {
		const { error: loginError } = await auth.signIn(email, password);
		if (loginError) error = loginError.message;
		else goto(resolve('/'));
	}

	async function loginWithGoogle() {
		const { error: googleError } = await auth.signInWithGoogle();
		if (googleError) error = googleError.message;
	}
</script>

<h1>Login</h1>
<span>Don't have any account?</span> <a href={resolve('/register')}>Register</a>.

<form on:submit|preventDefault={login}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<button type="submit">Login</button>
</form>
<a href={resolve('/forgot-password')}>Forgot password?</a>

<button on:click={loginWithGoogle}>Login with Google</button>

{#if error}
	<p style="color:red">{error}</p>
{/if}
