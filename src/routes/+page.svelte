<script lang="ts">
	import CreatePanel from './Create.svelte';
	import JoinPanel from './Join.svelte';
	import ContestPanel from './Contest.svelte';
	import type { SvelteComponent } from 'svelte/internal';

	import {
		ContentSwitcher,
		Switch,
		InlineNotification,
		NotificationActionButton,
		Tag,
		Tile 
	} from 'carbon-components-svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import SearchAdvanced from 'carbon-icons-svelte/lib/SearchAdvanced.svelte';
	import EarthFilled from 'carbon-icons-svelte/lib/EarthFilled.svelte';

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
		{ label: 'Contests', icon: EarthFilled, tag: "Coming Soon", disabled: true }
	];
	let tabIndex = 1;
</script>

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
			<CreatePanel {username} />
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
