<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { auth, type User } from '$lib/stores/auth';
	import Header from '$lib/components/header/Header.svelte';
	import { Spinner } from "$lib/components/ui/spinner/index.js";

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
</script>

{#if loading}
	<main class="bg-zinc-900 text-xl text-white h-screen w-screen flex items-center justify-center">
		<Spinner class="size-6" />
		<span class="ml-4">Loading...</span>
	</main>
{:else}
	<Header
		user={$auth.user}
		isAuthenticated={$auth.isAuthenticated}
		loading={$auth.loading}
	/>
	<main class="bg-zinc-900">
		<slot />
	</main>
{/if}
