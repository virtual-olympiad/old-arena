<script lang="ts">
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderGlobalAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SkipToContent,
		CodeSnippet
	} from 'carbon-components-svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

	import UserProfile from 'carbon-icons-svelte/lib/UserProfile.svelte';
	import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
	import Upgrade from 'carbon-icons-svelte/lib/Upgrade.svelte';

	import Login from 'carbon-icons-svelte/lib/Login.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';

	import Home from 'carbon-icons-svelte/lib/Home.svelte';
	import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
	import UserFollow from 'carbon-icons-svelte/lib/UserFollow.svelte';
	import Money from 'carbon-icons-svelte/lib/Money.svelte';
	import Debug from 'carbon-icons-svelte/lib/Debug.svelte';
	import UnknownFilled from 'carbon-icons-svelte/lib/UnknownFilled.svelte';
	import Book from 'carbon-icons-svelte/lib/Book.svelte';
	import InformationSquare from 'carbon-icons-svelte/lib/InformationSquare.svelte';

	import AsleepFilled from 'carbon-icons-svelte/lib/AsleepFilled.svelte';
	import Awake from 'carbon-icons-svelte/lib/Awake.svelte';

	import { app, user } from '$lib/sessionStore';
	import { auth, db, userDoc } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { signOut } from 'firebase/auth';
	import { socket } from '$lib/socket';
	import { onMount } from 'svelte';

	let isOpen1 = false;
	let isOpen2 = false;

	const toggleTheme = () => {
		$app.theme = ($app.theme == 'g90' ? 'g10':'g90');
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error(error);
		}
	};

	let display_name = '';

	user.subscribe(async (user) => {
		try {
			if (!user.user) {
				return;
			}

			const docSnap = await getDoc(doc(db, 'users', user.user?.uid, 'public/profile'));

			if (!docSnap.exists()) {
				throw new Error('User document does not exist');
			}

			({ display_name } = docSnap.data());
		} catch ({ message }) {
			console.error(message);
		}
	});

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<Header href="/">
	<svelte:fragment slot="platform">
		<img src="/mea_logo.png" alt="MEA Logo" style="padding: .5rem 0; margin-right: .5rem; max-height: 100%"/> 
		{innerWidth >= 672 ? "Virtual Olympiad":"VOLY"}
	</svelte:fragment>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction icon={$app?.theme == 'g90' ? Awake : AsleepFilled} on:click={toggleTheme} />
		<HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks>
				<HeaderPanelLink style="word-break: break-all; height: fit-content;"
					>{display_name || 'Guest' + (socket.id ? '_' + socket.id: '')}</HeaderPanelLink
				>
				<HeaderPanelDivider>Account</HeaderPanelDivider>
				<HeaderPanelLink href="/profile" target="_blank" class="header-icon-wrapper"
					><UserProfile class="header-icon" />Profile</HeaderPanelLink
				>
				<HeaderPanelLink href="/settings" target="_blank" class="header-icon-wrapper"
					><Settings class="header-icon" />Settings</HeaderPanelLink
				>
				{#if $user.user}
					<HeaderPanelLink on:click={handleLogout} class="header-icon-wrapper"
						><Logout class="header-icon" />Logout</HeaderPanelLink
					>
				{:else}
					<HeaderPanelLink href="/login" class="header-icon-wrapper"
						><Login class="header-icon" />Login</HeaderPanelLink
					>
				{/if}
				<HeaderPanelDivider />
				<HeaderPanelLink href="/premium" target="_blank" class="header-icon-wrapper"
					><Upgrade class="header-icon" />VOLY Premium</HeaderPanelLink
				>
				<HeaderPanelLink href="/donate" target="_blank" class="header-icon-wrapper"
					><Money class="header-icon" />Donate</HeaderPanelLink
				>
			</HeaderPanelLinks>
		</HeaderAction>
		<HeaderAction bind:isOpen={isOpen2} icon={Menu}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Math et al</HeaderPanelDivider>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"
					><Home class="header-icon" />Homepage</HeaderPanelLink
				>
				<HeaderPanelLink
					href="https://mathetal.org/discord"
					target="_blank"
					class="header-icon-wrapper"><LogoDiscord class="header-icon" />Discord</HeaderPanelLink
				>
				<HeaderPanelLink
					href="https://mathetal.org/apply"
					target="_blank"
					class="header-icon-wrapper"><UserFollow class="header-icon" />Join Us</HeaderPanelLink
				>
				<HeaderPanelLink href="/donate" target="_blank" class="header-icon-wrapper"
					><Money class="header-icon" />Donate</HeaderPanelLink
				>

				<HeaderPanelDivider>Help</HeaderPanelDivider>
				<HeaderPanelLink href="/about" class="header-icon-wrapper"
					><InformationSquare class="header-icon" />About</HeaderPanelLink
				>
				<HeaderPanelLink href="/guide" class="header-icon-wrapper"
					><Book class="header-icon" />Guide</HeaderPanelLink
				>
				<HeaderPanelLink href="/about#faq" class="header-icon-wrapper"
					><UnknownFilled class="header-icon" />FAQ</HeaderPanelLink
				>
				<HeaderPanelLink class="header-icon-wrapper"
					><Debug class="header-icon" />Report a Bug</HeaderPanelLink
				>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<style lang="scss">
</style>
