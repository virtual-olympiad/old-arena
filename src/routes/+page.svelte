<script lang="ts">
	import CreatePanel from './Create.svelte';
	import JoinPanel from './Join.svelte';
	import ContestPanel from './Contest.svelte';
	import { onMount, type SvelteComponent } from 'svelte/internal';

	import {
		ContentSwitcher,
		Switch,
		InlineNotification,
		NotificationActionButton,
		Tag,
		Tile,
		Modal,
		UnorderedList,
		ListItem
	} from 'carbon-components-svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import SearchAdvanced from 'carbon-icons-svelte/lib/SearchAdvanced.svelte';
	import EarthFilled from 'carbon-icons-svelte/lib/EarthFilled.svelte';

	import { user } from '$lib/sessionStore';
	import { supabase } from '$lib/supabaseClient';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session.user);
	});

	let modalOpen = false;

	onMount(() => {
		user.subscribe((user) => {
			if (!user) {
				modalOpen = true;
			}
		});
	});

	// Player username
	let username = '';

	interface DrawerItem {
		label: string;
		icon: SvelteComponent;
		beta?: string;
		disabled?: boolean;
	}

	let tabs = [
		{ label: 'Create', icon: AddFilled },
		{ label: 'Join', icon: SearchAdvanced },
		{ label: 'Contests', icon: EarthFilled, tag: 'Coming Soon', disabled: true }
	];
	let tabIndex = 1;
</script>

<Modal
	bind:open={modalOpen}
	modalHeading="Log In or Create an Account"
	primaryButtonText="Log In/Sign Up"
	secondaryButtonText="Continue as Guest"
	on:click:button--secondary={() => {
		modalOpen = false;
	}}
	on:click:button--primary={() => {
		window.location.href = '/login';
	}}
	on:open
	on:close
	on:submit
>
	<p>Creating an account unlocks many more features of Virtual Olympiad, including:</p>
	<br />
	<UnorderedList>
		<ListItem>Customizable username and profile page</ListItem>
		<ListItem>Ability to create rooms and join certain rooms</ListItem>
		<ListItem>Collect cookie currency to unlock cosmetic upgrades</ListItem>
		<ListItem>Social features such as friending & team messaging</ListItem>
	</UnorderedList>
	<br />
	And more!
</Modal>

<section>
	<InlineNotification
		lowContrast
		kind="info"
		title="Join our Discord:"
		subtitle="Don't miss out on regularly hosted events, POTW, groupsolves, and more!"
		style="flex-shrink: 0;"
	>
		<svelte:fragment slot="actions">
			<NotificationActionButton>Join Now</NotificationActionButton>
		</svelte:fragment>
	</InlineNotification>

	<ContentSwitcher bind:selectedIndex={tabIndex} size="xl">
		{#each tabs as tab}
			<Switch disabled={tab.disabled}>
				<div style="display: flex; align-items: center;">
					<svelte:component this={tab.icon} size={20} style="margin-right: 0.5rem;" />
					{tab.label}
					{#if tab.tag}
						<Tag disabled={tab.disabled} style="margin-left: 0.5rem;">{tab.tag}</Tag>
					{/if}
				</div>
			</Switch>
		{/each}
	</ContentSwitcher>
	<Tile light class="home-content">
		{#if tabIndex === 0}
			<CreatePanel />
		{:else if tabIndex === 1}
			<JoinPanel {username} />
		{:else if tabIndex === 2}
			<ContestPanel />
		{/if}
	</Tile>
</section>

<style lang="scss">
	@import '../variables.scss';

	section {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 100%;
		height: 100%;
	}
</style>
