<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel,
        FieldDescription,
        FieldSeparator,
    } from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { auth } from '$lib/stores/auth';
    import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
    import cards from "$lib/assets/cards.jpg";

	let email = '';
	let password = '';
	let error = '';

	async function login() {
		const { error: loginError } = await auth.signIn(email, password);
		if (loginError) {
            error = loginError.message;
            document.body.scrollIntoView();
        } else {
            goto(resolve('/'));
        }
	}

	async function loginWithGoogle() {
		const { error: googleError } = await auth.signInWithGoogle();
		if (googleError) {
            error = googleError.message;
            document.body.scrollIntoView();
        }
	}
</script>

<div class="flex flex-col gap-6">
    <Card.Root class="overflow-hidden bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-0 border border-purple-500/30">
        <Card.Content class="grid p-0 md:grid-cols-2">
            <form on:submit|preventDefault={login} class="p-6 md:p-8">
                <FieldGroup>
                    <div class="flex flex-col items-center gap-2 text-center text-white">
                        <h1 class="text-2xl font-bold">Welcome back</h1>
                        <p class="text-balance">
                            Login to your account
                        </p>
                        {#if error}
                            <p class="text-red-400">{error}</p>
                        {/if}
                    </div>
                    <Field>
                        <FieldLabel for="email" class="text-white">Email</FieldLabel>
                        <Input id="email" type="email" bind:value={email} placeholder="mail@example.com" required />
                    </Field>
                    <Field>
                        <div class="flex items-center">
                            <FieldLabel for="password" class="text-white">Password</FieldLabel>
                            <a href={resolve('/forgot-password')} class="ms-auto text-sm underline-offset-2 hover:underline text-white">
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" bind:value={password} required />
                    </Field>
                    <Field>
                        <Button type="submit">Login</Button>
                    </Field>
                    <FieldSeparator>
                        <span class="font-bold text-zin-800">OR</span>
                    </FieldSeparator>
                    <Field>
                        <Button variant="outline" type="button" onclick={loginWithGoogle}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Login with Google
                        </Button>
                    </Field>
                    <FieldDescription class="text-center text-gray-300">
                        Don't have an account? <a href={resolve('/register')} class="hover:!text-gray-100">Sign up</a>
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
