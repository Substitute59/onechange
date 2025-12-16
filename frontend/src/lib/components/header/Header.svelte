<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { auth, type User } from '$lib/stores/auth';
    import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Sheet, SheetClose, SheetContent, SheetTrigger } from "$lib/components/ui/sheet";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Separator } from "$lib/components/ui/separator";
	import Logo from "$lib/components/header/Logo.svelte";
    
    import {
        Bell,
        MessageSquare,
        Heart,
        User as UserIcon,
        Plus,
        Search,
        Menu,
        LogOut,
        Package,
        House,
        X
    } from "lucide-svelte";

    const props = $props<{
        user: User | null,
        isAuthenticated: boolean,
        loading: boolean
    }>();
     
    let sheetOpen = $state(false);
    
    beforeNavigate(() => {
        sheetOpen = false;
    });

    async function logout() {
		await auth.signOut();
		goto(resolve('/login'));
	}
</script>

<header class="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <Sheet bind:open={sheetOpen}>
                <SheetTrigger class="text-zinc-300 hover:text-white">
                    <Menu size={24} />
                </SheetTrigger>
                <SheetContent side="left" class="bg-zinc-900 border-zinc-800 w-64 p-0">
                    <ScrollArea class="h-full p-4 space-y-2">
                        <Logo />
                        <Separator class="my-4" />
                        <Button href="/" variant="navigation" size="navigation">
                            <House size={20} /> <span class="ml-3 font-medium">Accueil</span>
                        </Button>
                        <Button href="/annonces" variant="navigation" size="navigation">
                            <Search size={20} /> <span class="ml-3 font-medium">Explorer</span>
                        </Button>
                        <Button href="/annonces/nouvelle" variant="navigation" size="navigation">
                            <Plus size={20} /> <span class="ml-3 font-medium">Créer une annonce</span>
                        </Button>
                        <Button href="/mes-annonces" variant="navigation" size="navigation">
                            <Package size={20} /> <span class="ml-3 font-medium">Mes annonces</span>
                        </Button>
                        <Separator class="my-4" />
                        <Button onclick={logout} variant="navigation" size="navigation">
                            <LogOut size={20} /> <span class="ml-3 font-medium">Déconnexion</span>
                        </Button>
                    </ScrollArea>
                    <SheetClose class="absolute top-4 right-4 cursor-pointer text-zinc-400 hover:text-white">
                        <X />
                    </SheetClose>
                </SheetContent>
            </Sheet>
            <Logo />
        </div>
        <div class="hidden md:block flex-1 max-w-2xl mx-8 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <Input placeholder="Rechercher une carte, collection, utilisateur..." class="bg-zinc-800 border-zinc-700 text-white pl-10" />
        </div>
        <div class="flex items-center gap-3">
            {#if props.isAuthenticated}
                <Button href={resolve('/notifications')} variant="rounded" size="icon" class="relative text-zinc-300 hover:text-white">
                    <Bell size={20} />
                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
                <Button href={resolve('/messages')} variant="rounded" size="icon" class="relative text-zinc-300 hover:text-white">
                    <MessageSquare size={20} />
                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs rounded-full flex items-center justify-center">2</span>
                </Button>
                <Button href={resolve('/wishlist')} variant="rounded" size="icon" class="relative text-zinc-300 hover:text-white">
                    <Heart size={20} />
                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">2</span>
                </Button>
                <Button href={resolve('/profile')} class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center hover:ring-2 ring-purple-500">
                    <UserIcon size={18} class="text-white" />
                </Button>
            {:else}
                <Button href={resolve('/login')} variant="ghost" class="text-zinc-300 hover:text-white">
                    Se connecter
                </Button>
                <Button href={resolve('/register')} class="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                    S'inscrire
                </Button>
            {/if}
        </div>
    </div>
</header>
