<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PUBLIC_BACK_URL } from '$env/static/public';
	import { csrfStore } from '$lib/stores/csrf';
	export let data;

	let user = data.user;

	let username = user?.username || '';
	let avatar_url = user?.avatar_url || '';
	let bio = user?.bio || '';
	let age = user?.age || '';
	let city = user?.city || '';

	let error = '';
	let success = '';

	async function updateProfile() {
		if (!user) return;

		const csrfToken = await csrfStore.get();

		const res = await fetch(`${PUBLIC_BACK_URL}api/users/${user.id}/update/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken || ''
			},
			body: JSON.stringify({ username, avatar_url, bio, age, city }),
			credentials: 'include'
		});

		if (!res.ok) {
			const data = await res.json();
			error = data.error || 'Erreur lors de la mise à jour';
			return;
		}

		success = 'Profil mis à jour !';
		setTimeout(() => goto(resolve('/profile')), 1500);
	}
</script>

<h1>Modifier mon profil</h1>

{#if error}<p style="color:red">{error}</p>{/if}
{#if success}<p style="color:green">{success}</p>{/if}

<form on:submit|preventDefault={updateProfile}>
	<label>
		Username:
		<input type="text" bind:value={username} required />
	</label>
	<label>
		Avatar URL:
		<input type="text" bind:value={avatar_url} />
	</label>
	<label>
		Bio:
		<textarea bind:value={bio}></textarea>
	</label>
	<label>
		Age:
		<input type="number" bind:value={age} />
	</label>
	<label>
		City:
		<input type="text" bind:value={city} />
	</label>
	<button type="submit">Mettre à jour</button>
</form>
