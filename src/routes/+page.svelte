<script lang="ts">
	import CreatePanel from '$lib/Create.svelte';
	import JoinPanel from '$lib/Join.svelte';
	import ContestPanel from '$lib/Contest.svelte';
	import { onMount, type SvelteComponent } from 'svelte';

	import {
		ContentSwitcher,
		Switch,
		InlineNotification,
		NotificationActionButton,
		Tag,
		Tile,
		Modal,
		UnorderedList,
		ListItem,
		TooltipDefinition,
		Tooltip,
		OutboundLink
	} from 'carbon-components-svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import SearchAdvanced from 'carbon-icons-svelte/lib/SearchAdvanced.svelte';
	import EarthFilled from 'carbon-icons-svelte/lib/EarthFilled.svelte';
	import Help from 'carbon-icons-svelte/lib/Help.svelte';

	import { user } from '$lib/sessionStore';
	import { goto } from '$app/navigation';

	let modalOpen = false;

	onMount(() => {
		user.subscribe((user) => {
			if (!user.user) {
				modalOpen = true;
			} else {
				modalOpen = false;
			}
		});
	});

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

	let innerWidth: number;
</script>

<Modal
	bind:open={modalOpen}
	modalHeading="Log In or Create an Account"
	primaryButtonText="Log In/Sign Up"
	secondaryButtonText="Check out VOLY as Guest"
	on:click:button--secondary={() => {
		modalOpen = false;
	}}
	on:click:button--primary={async () => {
		await goto('/login');
	}}
	on:open
	on:close
	on:submit
>
	<span style="display: flex; align-items: center;">
		<strong>You'll need to log in to an account to create and join VOLY rooms.</strong>
		<Tooltip
			style="margin-left: 1rem; font-size: 12px;"
			direction="right"
			align="start"
			triggerText="Why?"
			icon={Help}
		>
			We are not-for-profit, and solely rely on donations to fund our projects. As such we can
			currently only operate with rather limited resources (e.g server traffic, user storage). To
			prevent resource abuse we kindly request that users create accounts before using VOLY.
		</Tooltip>
	</span>

	<br />
	<p>Creating an account also unlocks many more features of Virtual Olympiad, including:</p>
	<UnorderedList>
		<ListItem>Customizable profile, username, and avatar</ListItem>
		<ListItem
			>Unlock fun cosmetic upgrades with virtual
			<TooltipDefinition direction="top" align="start">
				currency
				<span slot="tooltip" style="font-size: 12px;">
					Math et al. is not-for-profit, no real money transactions are available or take place on
					the platform.
				</span>
			</TooltipDefinition>
			earned through playing and participating in events!
		</ListItem>
		<ListItem>Social features such as friend system and room chat</ListItem>
		<ListItem>Collect achievements, keep track of statistics, and much more!</ListItem>
	</UnorderedList>
	<br />
	<p>
		Also join the
		<OutboundLink href="https://mathetal.org/discord/">Math et al Discord</OutboundLink>, an active
		community of 200+ members. Participate in weekly events, discuss STEM with peers and find others
		to play VOLY with!
	</p>
</Modal>

<svelte:window bind:innerWidth />
<section>
	<InlineNotification
		lowContrast
		kind="info"
		title="Join our Discord:"
		subtitle="Don't miss out on regularly hosted events, POTW, groupsolves, and more!"
		style="flex-shrink: 0; align-items: center;"
	>
		<svelte:fragment slot="actions">
			<NotificationActionButton>Join Now</NotificationActionButton>
		</svelte:fragment>
	</InlineNotification>

	<ContentSwitcher bind:selectedIndex={tabIndex} size="xl">
		{#each tabs as tab, i}
			{#if i != 2 || innerWidth >= 672}
				<Switch disabled={tab.disabled}>
					<div style="display: flex; align-items: center;">
						<svelte:component this={tab.icon} size={20} style="margin-right: 0.5rem;" />
						{tab.label}
						{#if tab.tag}
							<Tag disabled={tab.disabled} style="margin-left: 0.5rem;">{tab.tag}</Tag>
						{/if}
					</div>
				</Switch>
			{/if}
		{/each}
	</ContentSwitcher>
	<Tile light class="home-content">
		{#if tabIndex === 0}
			<CreatePanel />
		{:else if tabIndex === 1}
			<JoinPanel />
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
