<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { updateUser } from '$lib/services/users';
	export let data;

	let user = data.user;

	let username = user?.username || '';
	let avatar_url = user?.avatar_url || '';
	let avatarFile: File | null = null;
	let bio = user?.bio || '';
	let age = user?.age || undefined;
	let city = user?.city || '';

	let error = '';
	let success = '';

	async function updateProfile() {
		if (!user) return;

		const formData = new FormData();
		formData.append("username", username);
		formData.append("avatar_url", avatar_url);
		formData.append("bio", bio ?? "");
		formData.append("age", age?.toString() ?? "");
		formData.append("city", city ?? "");

		if (avatarFile) {
			formData.append("avatar", avatarFile);
		}

		const resp = await updateUser(user.id, formData);

		if (resp.error) {
			error = resp.error || 'Erreur lors de la mise à jour';
			return;
		}

		success = 'Profil mis à jour !';
		setTimeout(() => goto(resolve('/profile')), 1500);
	}
</script>

<h1>Modifier mon profil</h1>

{#if error}<p style="color:red">{error}</p>{/if}
{#if success}<p style="color:green">{success}</p>{/if}

<form on:submit|preventDefault={updateProfile} enctype="multipart/form-data">
	<label>
		Username:
		<input type="text" bind:value={username} required />
	</label>
	<label>
		Avatar:
		<input 
			type="file"
			on:change={(e: Event) => {
				const input = e.target as HTMLInputElement;
				avatarFile = input?.files?.[0] ?? null;
			}}
			name="avatarFile"
			accept="image/*"
		/>
		{#if avatar_url}
			<img src={avatar_url} alt="Avatar" width="50" />
		{/if}
		<input type="hidden" bind:value={avatar_url}>
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
