<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import type { User } from '$lib/stores/auth';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let user: User | null = null;
	let isAuthenticated = false;
	let loading = true;

	const unsubscribe = auth.subscribe((state) => {
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
		goto(resolve('/login'));
	}
</script>

{#if loading}
	<span>Loading...</span>
{:else}
	<header>
		<nav>
			{#if isAuthenticated}
				<span>Hi, {user?.username || user?.email}!</span>
				<a href={resolve('/profile')}>Mon profil</a>
				<button on:click={logout}>Logout</button>
			{:else}
				<a href={resolve('/login')}>Login</a>
			{/if}
		</nav>
	</header>

	<main class="bg-zinc-900">
		<slot />
	</main>
{/if}
