<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel,
        FieldDescription
    } from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
	import { auth } from '$lib/stores/auth';
	import { createUser } from '$lib/services/users';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
    import cards from "$lib/assets/cards.jpg";

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
            document.body.scrollIntoView();
			return;
		}

		const { data, error: signUpError } = await auth.signUp(email, password);

		if (signUpError) {
			error = signUpError.message;
            document.body.scrollIntoView();
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
            document.body.scrollIntoView();
			setTimeout(() => goto(resolve('/login')), 2000);
		} catch (err) {
			error = (err as Error).message;
            document.body.scrollIntoView();
		}
	}
</script>

<div class="flex flex-col gap-6">
    <Card.Root class="overflow-hidden bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-0 border border-purple-500/30">
        <Card.Content class="grid p-0 md:grid-cols-2">
            <form on:submit|preventDefault={register} enctype="multipart/form-data" class="p-6 md:p-8">
                <FieldGroup>
                    <div class="flex flex-col items-center gap-2 text-center text-white">
                        <h1 class="text-2xl font-bold">Create your account</h1>
                        <p class="text-balance">
                            Fill in the form below to create your account
                        </p>
                        {#if error}
                            <p class="text-red-400">{error}</p>
                        {/if}
                        {#if success}
                            <p class="text-green-500">{success}</p>
                        {/if}
                    </div>
                    <Field>
                        <FieldLabel for="username" class="text-white">Username</FieldLabel>
                        <Input id="username" type="text" bind:value={username} required />
                    </Field>
                    <Field>
                        <FieldLabel for="email" class="text-white">Email</FieldLabel>
                        <Input id="email" type="email" bind:value={email} placeholder="mail@example.com" required />
                    </Field>
                    <Field>
                        <FieldLabel for="password" class="text-white">Password</FieldLabel>
                        <Input id="password" type="password" bind:value={password} required />
                    </Field>
                    <Field>
                        <FieldLabel for="confirmPassword" class="text-white">Confirm Password</FieldLabel>
                        <Input id="confirmPassword" type="password" bind:value={confirmPassword} required />
                    </Field>
                    <Field>
                        <FieldLabel for="avatarFile" class="text-white">Avatar</FieldLabel>
                        <Input
                            id="avatarFile"
                            type="file"
                            onchange={(e: Event) => {
                                const input = e.target as HTMLInputElement;
                                avatarFile = input?.files?.[0] ?? null;
                            }}
                            name="avatarFile"
                            accept="image/*"
                        />
                    </Field>
                    <Field>
                        <FieldLabel for="bio" class="text-white">Bio</FieldLabel>
                        <Textarea id="bio" bind:value={bio} />
                    </Field>
                    <Field>
                        <FieldLabel for="age" class="text-white">Age</FieldLabel>
                        <Input id="age" type="number" bind:value={age} />
                    </Field>
                    <Field>
                        <FieldLabel for="city" class="text-white">City</FieldLabel>
                        <Input id="city" type="text" bind:value={city} />
                    </Field>
                    <Field>
                        <Button type="submit">Create Account</Button>
                    </Field>
                    <FieldDescription class="text-center text-gray-300">
                        Already have an account? <a href={resolve('/login')} class="hover:!text-gray-100">Sign in</a>
                    </FieldDescription>
                </FieldGroup>
            </form>
            <div class="bg-muted relative hidden md:block">
                <img
                    src="{cards}"
                    alt="Cards"
                    class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </Card.Content>
    </Card.Root>
</div>
