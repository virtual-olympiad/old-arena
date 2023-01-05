<script lang="ts">
	import ProfileSettings from './ProfileSettings.svelte';
	import AccountSettings from './AccountSettings.svelte';
	import SocialSettings from './SocialSettings.svelte';

	import { Tabs, Tab, TabContent } from 'carbon-components-svelte';
	import { user } from '$lib/sessionStore';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	if (browser) {
		user.subscribe(async (user) => {
			if (!user.user) {
				await goto('/login');
			}
		});
	}
</script>

<section class="settings">
	<Tabs class="flex-tabs">
		<Tab label="Profile Settings" />
		<Tab label="Account" />
		<Tab label="Social" />
		<svelte:fragment slot="content">
			<TabContent style="width: 100%; flex: 1 0 auto;" class="centered-tab"
				><ProfileSettings /></TabContent
			>
			<TabContent style="width: 100%; flex: 1 0 auto;" class="centered-tab"
				><AccountSettings /></TabContent
			>
			<TabContent style="width: 100%; flex: 1 0 auto;" class="centered-tab"
				><SocialSettings /></TabContent
			>
		</svelte:fragment>
	</Tabs>
</section>

<style lang="scss">
	.settings {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: min(100%, 672px);
		height: 100%;
	}
</style>
