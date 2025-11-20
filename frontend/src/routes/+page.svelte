<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { resolve } from '$app/paths';
</script>

<h1>Welcome to the home page</h1>

{#if $auth.isAuthenticated}
	<p>Hi there {$auth.user?.username}!</p>
	<p>You are logged in.</p>
{:else}
	<p>
		You are not logged in.
		<a href={resolve('/login')}>Login</a>
	</p>
{/if}
