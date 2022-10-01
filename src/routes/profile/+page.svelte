<script lang="ts">
	import {
		FluidForm,
		TextInput,
		PasswordInput,
		Tile,
		Button,
		DatePicker,
		DatePickerInput,
		TooltipDefinition,
		Link,
		Form,
		FormGroup,
		TextArea,
		TooltipIcon,
		RadioButtonGroup,
		RadioButton,
		Toggle,
		Tabs,
		Tab,
		TabContent
	} from 'carbon-components-svelte';

	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';

	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';

	user.set(!!supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(!!session?.user);
	});

	let loading = false,
		username = '',
		display_name = '',
		about = '',
		website = '',
		avatar_url = '';

	onMount(() => {
		user.subscribe((user) => {
			if (!user) {
				window.location.href = '/';
			}
		});

		try {
			loading = true;
			const supabaseUser = supabase.auth.user();

			supabase
				.from('profiles')
				.select(`username, display_name, about, website, avatar_url`)
				.eq('id', supabaseUser?.id)
				.single()
				.then(({ data, error, status }) => {
					if (data) {
						({username, display_name, about, website, avatar_url} = data);
					}
					if (error && status !== 406) throw error;
				});
		} catch ({ message }) {
			alert(message);
		} finally {
			loading = false;
		}
	});
</script>

<section class="profile-panel">
	<Tile style="height: 100%;">
		<div class="profile-user">
			<h1 class="profile-display-name">{display_name}</h1>
			<span class="profile-username">@{username}</span>
		</div>
		<Tabs style="display: flex; justify-content: center; text-align: center;">
			<Tab label="Stats" />
			<Tab label="Friends" />
			<Tab label="Starred Problems" />
			<svelte:fragment slot="content">
				<TabContent class="centered-tab">Content 1</TabContent>
				<TabContent class="centered-tab">Content 2</TabContent>
				<TabContent class="centered-tab">Content 3</TabContent>
			</svelte:fragment>
		</Tabs>
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.profile-panel {
		display: flex;
		justify-content: center;
		flex-direction: column;

		padding: 1rem;

		height: 100%;
		width: min(100%, 672px);
	}

	.profile-user {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin: 3rem 0;

		.profile-username {
			user-select: none;
			margin-top: 0.25rem;

			color: #bbbbbb;
		}
	}
</style>
