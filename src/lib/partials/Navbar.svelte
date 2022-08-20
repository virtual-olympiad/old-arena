<script lang="ts">
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderGlobalAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SkipToContent
	} from 'carbon-components-svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
    import Menu from "carbon-icons-svelte/lib/Menu.svelte";

	import UserProfile from "carbon-icons-svelte/lib/UserProfile.svelte";
	import Settings from "carbon-icons-svelte/lib/Settings.svelte";
	import Upgrade from "carbon-icons-svelte/lib/Upgrade.svelte";

	import Login from "carbon-icons-svelte/lib/Login.svelte";
	import Logout from "carbon-icons-svelte/lib/Logout.svelte";

	import Home from "carbon-icons-svelte/lib/Home.svelte";
	import LogoDiscord from "carbon-icons-svelte/lib/LogoDiscord.svelte";
	import UserFollow from "carbon-icons-svelte/lib/UserFollow.svelte";
	import Money from "carbon-icons-svelte/lib/Money.svelte";
	import Debug from "carbon-icons-svelte/lib/Debug.svelte";
	import UnknownFilled from "carbon-icons-svelte/lib/UnknownFilled.svelte";
	import Book from "carbon-icons-svelte/lib/Book.svelte";
	import InformationSquare from "carbon-icons-svelte/lib/InformationSquare.svelte";

    import AsleepFilled from "carbon-icons-svelte/lib/AsleepFilled.svelte";
    import Awake from "carbon-icons-svelte/lib/Awake.svelte";

	let isOpen1 = false;
	let isOpen2 = false;
    
    $: DarkModeIcon = darkMode ? Awake:AsleepFilled;
    const toggleDarkMode = ()=> {
        darkMode = !darkMode;
    }

    export let darkMode: boolean;
</script>

<Header company="MEA's" platformName="Virtual Olympiad">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
        <HeaderGlobalAction icon={DarkModeIcon} on:click={toggleDarkMode}/>
		<HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks>
				<HeaderPanelLink>Guest-0102</HeaderPanelLink>
				<HeaderPanelLink class="header-icon-wrapper"><Login class="header-icon"/>Login</HeaderPanelLink>
				<HeaderPanelDivider>Account</HeaderPanelDivider>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"><UserProfile class="header-icon"/>Profile</HeaderPanelLink>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"><Settings class="header-icon"/>Settings</HeaderPanelLink>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"><Upgrade class="header-icon"/>VOLY Premium</HeaderPanelLink>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"><Money class="header-icon"/>Donate</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
		<HeaderAction bind:isOpen={isOpen2} icon={Menu}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Math et al</HeaderPanelDivider>
				<HeaderPanelLink href="https://mathetal.org" target="_blank" class="header-icon-wrapper"><Home class="header-icon"/>Homepage</HeaderPanelLink>
                <HeaderPanelLink href="https://mathetal.org/discord" target="_blank" class="header-icon-wrapper"><LogoDiscord class="header-icon"/>Discord</HeaderPanelLink>
                <HeaderPanelLink href="https://mathetal.org/apply" target="_blank" class="header-icon-wrapper"><UserFollow class="header-icon"/>Join Us</HeaderPanelLink>
				<HeaderPanelLink href="/donate" target="_blank" class="header-icon-wrapper"><Money class="header-icon"/>Donate</HeaderPanelLink>

                <HeaderPanelDivider>Help</HeaderPanelDivider>
                <HeaderPanelLink class="header-icon-wrapper"><InformationSquare class="header-icon"/>About</HeaderPanelLink>
                <HeaderPanelLink class="header-icon-wrapper"><Book class="header-icon"/>Guide</HeaderPanelLink>
                <HeaderPanelLink class="header-icon-wrapper"><UnknownFilled class="header-icon"/>FAQ</HeaderPanelLink>
                <HeaderPanelLink class="header-icon-wrapper"><Debug class="header-icon"/>Report a Bug</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<style lang="scss" global>
	a.header-icon-wrapper {
		display: flex; 
		align-items: center;

		.header-icon {
			margin-right: .5rem;
		}
	}
</style>
