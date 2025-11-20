<script lang="ts">
	import { resolve } from '$app/paths';
	export let data;
	let user = data.user;
</script>

<h1>Mon profil</h1>

{#if user}
	<p>Username: {user.username}</p>
	<p>Avatar: <img src={user.avatar_url} alt="Avatar" width="50" /></p>
	<p>Bio: {user.bio}</p>
	<p>Age: {user.age}</p>
	<p>City: {user.city}</p>
	<a href={resolve('/profile/edit')}>Modifier mon profil</a>
{:else}
	<p>Impossible de récupérer le profil.</p>
{/if}
