<script lang="ts">
    import { onMount } from 'svelte';
    import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase';
    import { createUser, loadUser } from '$lib/services/users';
    import { Spinner } from "$lib/components/ui/spinner/index.js";

    let accessToken: string;

    onMount(async () => {
        const hash = window.location.hash;
		if (hash) {
			const params = new URLSearchParams(hash.slice(1));
			accessToken = params.get('access_token') || '';
		}

        if (accessToken) {
            return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            goto(resolve('/login'));
            return;
        }

        if (session?.user) {
            const uid = session.user.id;

            const existingUser = await loadUser();

            if (existingUser.user) {
                goto(resolve('/profile'));
                return;
            }

            const formData = new FormData();
            formData.append("id", uid);
            formData.append("username", session.user.user_metadata?.full_name || '');
            const resp = await createUser(formData);

			if (resp.error) {
				goto(resolve('/login'));
				return;
			}

            goto(resolve('/profile'));
        }
    });
</script>

<main class="bg-zinc-900 text-xl text-white h-screen w-screen flex items-center justify-center">
    <Spinner class="size-6" />
    <span class="ml-4">Loading...</span>
</main>
