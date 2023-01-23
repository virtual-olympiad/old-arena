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
		CodeSnippet,
		HeaderActionLink
	} from 'carbon-components-svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

	import DataBase from "carbon-icons-svelte/lib/DataBase.svelte";

	import UserProfile from 'carbon-icons-svelte/lib/UserProfile.svelte';
	import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
	import PaintBrush from 'carbon-icons-svelte/lib/PaintBrush.svelte';

	import Login from 'carbon-icons-svelte/lib/Login.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';

	import Home from 'carbon-icons-svelte/lib/Home.svelte';
	import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
	import LogoYoutube from 'carbon-icons-svelte/lib/LogoYoutube.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import LogoInstagram from 'carbon-icons-svelte/lib/LogoInstagram.svelte';
	
	import UserFollow from 'carbon-icons-svelte/lib/UserFollow.svelte';
	import Money from 'carbon-icons-svelte/lib/Money.svelte';
	import Debug from 'carbon-icons-svelte/lib/Debug.svelte';
	import UnknownFilled from 'carbon-icons-svelte/lib/UnknownFilled.svelte';
	import Book from 'carbon-icons-svelte/lib/Book.svelte';
	import InformationSquare from 'carbon-icons-svelte/lib/InformationSquare.svelte';
	import UserAdmin from 'carbon-icons-svelte/lib/UserAdmin.svelte';
	import Partnership from 'carbon-icons-svelte/lib/Partnership.svelte';

	import AsleepFilled from 'carbon-icons-svelte/lib/AsleepFilled.svelte';
	import Awake from 'carbon-icons-svelte/lib/Awake.svelte';

	import { app, user } from '$lib/sessionStore';
	import { auth, db, userDoc } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { signOut } from 'firebase/auth';
	import { socket } from '$lib/socket';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isOpen1 = false;
	let isOpen2 = false;

	const toggleTheme = () => {
		$app.theme = $app.theme == 'g90' ? 'g10' : 'g90';
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			goto('/login');
		} catch (error) {
			console.error(error);
		}
	};

	let display_name = '';

	user.subscribe(async (user) => {
		try {
			if (!user.user) {
				display_name = '';
				return;
			}

			const docSnap = await getDoc(doc(db, 'users', user.user?.uid, 'public/profile'));

			if (!docSnap.exists()) {
				display_name = '';
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
		<img
			src="/mea_logo.png"
			alt="MEA Logo"
			style="padding: .5rem; margin-right: .5rem; margin-left: -.5rem; height: 100%; aspect-ratio: 1/1"
		/>
		{innerWidth >= 672 ? 'Virtual Olympiad' : 'VOLY'}
	</svelte:fragment>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction icon={$app?.theme == 'g90' ? Awake : AsleepFilled} on:click={toggleTheme} />
		<HeaderActionLink icon={DataBase} target="_blank" href="https://vodb.mathetal.org" />
		<HeaderAction
			bind:isOpen={isOpen1}
			text={display_name || 'Guest'}
			icon={UserAvatarFilledAlt}
			closeIcon={UserAvatarFilledAlt}
		>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Account</HeaderPanelDivider>
				<HeaderPanelLink href="/profile" target="_blank" class="header-icon-wrapper"
					><UserProfile class="header-icon" />Profile</HeaderPanelLink
				>
				<HeaderPanelLink href="/settings" target="_blank" class="header-icon-wrapper"
					><Settings class="header-icon" />Settings</HeaderPanelLink
				>
				<HeaderPanelLink href="/shop" class="header-icon-wrapper"
					><PaintBrush class="header-icon" />Customize</HeaderPanelLink
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
			</HeaderPanelLinks>
		</HeaderAction>
		<HeaderAction bind:isOpen={isOpen2} icon={Menu}>
			<HeaderPanelLinks>
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
				<HeaderPanelLink href="https://github.com/Math-et-al/vo/issues" class="header-icon-wrapper"
					><Debug class="header-icon" />Report a Bug</HeaderPanelLink
				>

				<!-- Support -->
				<HeaderPanelDivider>Support Us</HeaderPanelDivider>
				<HeaderPanelLink
					href="https://mathetal.org/apply"
					target="_blank"
					class="header-icon-wrapper"><UserFollow class="header-icon" />Join Us</HeaderPanelLink
				>
				<HeaderPanelLink href="/donate" target="_blank" class="header-icon-wrapper"
					><Money class="header-icon" />Donate</HeaderPanelLink
				>
				<HeaderPanelLink href="/sponsor" target="_blank" class="header-icon-wrapper"
					><Partnership class="header-icon" />Sponsor Us</HeaderPanelLink
				>
				<!-- Math et al -->
				<HeaderPanelDivider>Community</HeaderPanelDivider>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"
					><Home class="header-icon" />Math et al</HeaderPanelLink
				>
				<HeaderPanelLink
					href="https://discord.gg/3eXC9UE6rT"
					target="_blank"
					class="header-icon-wrapper"><LogoDiscord class="header-icon" />Discord</HeaderPanelLink
				>
				<HeaderPanelLink
					href="https://github.com/Math-et-al"
					target="_blank"
					class="header-icon-wrapper"><LogoGithub class="header-icon" />Github</HeaderPanelLink
				>
				<HeaderPanelLink
					href="https://www.instagram.com/math_et_al"
					target="_blank"
					class="header-icon-wrapper"><LogoYoutube class="header-icon" />Youtube</HeaderPanelLink
				>
				<HeaderPanelLink
					href="https://www.youtube.com/@math_et_al"
					target="_blank"
					class="header-icon-wrapper"><LogoInstagram class="header-icon" />Instagram</HeaderPanelLink
				>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<style lang="scss">
</style>
