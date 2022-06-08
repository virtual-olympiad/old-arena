<script lang="ts">
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';

	import CreateRoom from './create.svelte';
	import JoinRoom from './join.svelte';

	// Player username
	let username = '';

	interface DrawerItem {
		label: string;
		icon?: string;
	}

    let tabs = [{label: 'Create', icon: 'add_circle'}, {label: 'Join', icon: 'travel_explore'}, /*{label: 'Custom', icon: 'star'},*/ {label: 'Contests', icon: 'verified'}];
	let tabItem = tabs[0];
</script>

<section>
	<article class="content">
		<div class="username-field">
			<Textfield variant="filled" bind:value={username} label="Username" input$maxlength={18} style="width: 100%;">
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
				<CreateRoom />
			{:else if tabItem.label === 'Join'}
				<JoinRoom />
			{:else}
				<Paper class = "content-contests">
					<Title>Contest Client</Title>
					<Subtitle>Work in progress</Subtitle>
					<Content>This feature is still undergoing development and experimentation</Content>
				</Paper>
			{/if}
		</article>
	</article>
</section>

<style lang="scss">
    @import '../variables.scss';

	section {
		position: relative;
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

        .content {
            position: relative;
            display: flex;
			flex-direction: column;
			align-items: center;

            height: calc(100% - 2rem);
			max-height: 960px;
            width: 75%;
			max-width: 1200px;

            border: 1px solid $border-color;
            overflow: hidden;
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
			flex-direction: column;
			align-items: center;
			justify-content: center;

			width: 100%;
			height: 100%;

			background-color: #eee;

			.content-contests {
				margin: 0 auto;
			}
		}
	}
</style>
