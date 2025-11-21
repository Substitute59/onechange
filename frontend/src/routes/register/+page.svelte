<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { createUser } from '$lib/services/users';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let email: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let username: string = '';
	let avatarFile: File | null = null;
	let bio: string = '';
	let age:number | undefined = undefined;
	let city: string = '';
	let error: string = '';
	let success: string = '';

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

			const formData = new FormData();
			formData.append("id", userId);
			formData.append("username", username);
			formData.append("bio", bio ?? "");
			formData.append("age", age?.toString() ?? "");
			formData.append("city", city ?? "");

			if (avatarFile) {
				formData.append("avatar", avatarFile);
			}

			const resp = await createUser(formData);

			if (resp.error) {
				error = resp.error || 'Erreur lors de la création';
				return;
			}

			success = 'Registration successful! Please check your email to confirm your account.';
			setTimeout(() => goto(resolve('/login')), 2000);
		} catch (err) {
			error = (err as Error).message;
		}
	}
</script>

<h1>Register</h1>
<span>Already have an account?</span> <a href={resolve('/login')}>Log in</a>.

<form on:submit|preventDefault={register} enctype="multipart/form-data">
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
	<label>
		Email:
		<input type="email" placeholder="Email" bind:value={email} required />
	</label>
	<label>
		Password:
		<input type="password" placeholder="Password" bind:value={password} required />
	</label>
	<label>
		Confirm Password:
		<input type="password" placeholder="Confirm Password" bind:value={confirmPassword} required />
	</label>
	<button type="submit">Register</button>
</form>

{#if error}
	<p style="color:red">{error}</p>
{/if}

{#if success}
	<p style="color:green">{success}</p>
{/if}
