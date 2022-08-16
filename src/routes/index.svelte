<script lang="ts">
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';

	import CreatePanel from './create.svelte';
	import JoinPanel from './join.svelte';
	import ContestPanel from './contest.svelte';

	// Player username
	let username = '';

	interface DrawerItem {
		label: string;
		icon?: string;
	}

    let tabs = [{label: 'Create', icon: 'add_circle'}, {label: 'Join', icon: 'travel_explore'}, /*{label: 'Custom', icon: 'star'},*/ {label: 'Contests', icon: 'verified'}];
	let tabItem = tabs[0];
</script>

<section class="content">
	<div class="username-field">
		<Textfield variant="outlined" bind:value={username} label="Username" input$maxlength={18} style="width: 100%;">
			<CharacterCounter slot="helper">0 / 18</CharacterCounter>
		</Textfield>
	</div>
	<div class="tab-bar">
		<TabBar {tabs} let:tab bind:active={tabItem}>
			<Tab {tab}>
			<Icon class="material-icons">{tab.icon}</Icon>
			<Label>{tab.label}</Label>
			</Tab>
		</TabBar>
	</div>
	<article class="main-content">
		{#if tabItem.label == 'Create'}
			<CreatePanel {username} />
		{:else if tabItem.label === 'Join'}
			<JoinPanel {username} />
		{:else}
			<ContestPanel />
		{/if}
	</article>
</section>

<style lang="scss">
    @import '../variables.scss';

	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;

		flex-grow: 0;

		height: 100%;
		width: 75%;
		max-width: 1200px;
		
		border: 1px solid $border-color;
		z-index: 0;

		background-color: #ffffff;

		.username-field {
			padding: 1rem;
			width: clamp(263px, 50%, 500px);
		}

		.tab-bar {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: 100%;
		}
	}

	.main-content {
		display: flex;
		align-items: center;
		flex-direction: column;

		width: 100%;
		height: 100%;
		overflow: auto;

		background-color: $background-color;

		.content-contests {
			margin: 0 auto;
		}
	}
</style>
