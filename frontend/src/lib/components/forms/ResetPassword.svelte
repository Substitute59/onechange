<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel
    } from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let newPassword = '';
	let message = '';
	let error = '';

	let accessToken = '';

	onMount(() => {
		const hash = window.location.hash;
		if (hash) {
			const params = new URLSearchParams(hash.slice(1));
			accessToken = params.get('access_token') || '';
		}
		if ($auth.isAuthenticated || !accessToken) {
			goto(resolve('/'));
		}
	});

	async function submit() {
		const { error: err } = await auth.resetPassword(newPassword);

		if (err) {
			error = err.message;
		} else {
			message =
				'Mot de passe réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion.';
			newPassword = '';
			setTimeout(() => goto(resolve('/login')), 2000);
		}
	}
</script>

<div class="flex flex-col gap-6">
    <Card.Root class="overflow-hidden bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-0 border border-purple-500/30">
        <Card.Content class="grid p-0">
            <form on:submit|preventDefault={submit} class="p-6 md:p-8">
                <FieldGroup>
                    <div class="flex flex-col items-center gap-2 text-center text-white">
                        <h1 class="text-2xl font-bold">Reset Password</h1>
                        <p class="text-balance">
                            Enter your new password below
                        </p>
                        {#if error}
                            <p class="text-red-400">{error}</p>
                        {/if}
                        {#if message}
                            <p class="text-green-500">{message}</p>
                        {/if}
                    </div>
                    <Field>
                        <FieldLabel for="newPassword" class="text-white">New Password</FieldLabel>
                        <Input id="newPassword" type="password" bind:value={newPassword} required />
                    </Field>
                    <Field>
                        <Button type="submit">Send Link</Button>
                    </Field>
                </FieldGroup>
            </form>
        </Card.Content>
    </Card.Root>
</div>
