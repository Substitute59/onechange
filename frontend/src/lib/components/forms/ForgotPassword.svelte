<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel
    } from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
	import { auth } from '$lib/stores/auth';

	let email = '';
	let message = '';
	let error = '';

	async function submit() {
		message = '';
		error = '';

		const { error: err } = await auth.forgotPassword(email);

		if (err) {
			error = err.message;
		} else {
			message = 'Si ce mail existe, un lien de réinitialisation a été envoyé.';
			email = '';
		}
	}
</script>

<div class="flex flex-col gap-6">
    <Card.Root class="overflow-hidden bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-0 border border-purple-500/30">
        <Card.Content class="grid p-0">
            <form on:submit|preventDefault={submit} class="p-6 md:p-8">
                <FieldGroup>
                    <div class="flex flex-col items-center gap-2 text-center text-white">
                        <h1 class="text-2xl font-bold">Forgot Password?</h1>
                        <p class="text-balance">
                            Request a reset link
                        </p>
                        {#if error}
                            <p class="text-red-400">{error}</p>
                        {/if}
                        {#if message}
                            <p class="text-green-500">{message}</p>
                        {/if}
                    </div>
                    <Field>
                        <FieldLabel for="email" class="text-white">Email</FieldLabel>
                        <Input id="email" type="email" bind:value={email} placeholder="mail@example.com" required />
                    </Field>
                    <Field>
                        <Button type="submit">Send Link</Button>
                    </Field>
                </FieldGroup>
            </form>
        </Card.Content>
    </Card.Root>
</div>
