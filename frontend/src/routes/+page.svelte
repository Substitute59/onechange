<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { auth } from '../lib/stores/auth';
    import type { User } from '../lib/stores/auth';
    import { goto } from '$app/navigation';

    let user: User;
    let isAuthenticated: boolean;

    const unsubscribe = auth.subscribe(state => {
        user = state.user!;
        isAuthenticated = state.isAuthenticated;
    });

    async function logout() {
        try {
            await auth.logout();
            goto('/login');
        } catch (error) {
            console.error(error);
        }
    }

    onMount(async () => {
        await auth.fetchUser();
    });
    
    onDestroy(unsubscribe); 
</script>

<h1>Welcome to the home page</h1>

{#if isAuthenticated}
    <p>Hi there {user?.username}!</p>
    <p>You are logged in.</p>
    <button on:click={logout}>Logout</button>
{:else}
    <p>
        You are not logged in.
        <a href="/login">Login</a>
    </p>
{/if}
