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
		Tag,
		Tab,
		TabContent,
		Tooltip,
		CodeSnippet,
		OutboundLink
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

	interface ProfileBadge {
		name: string;
		icon: string;
		color?: string;
		textcolor?: string;
		description: string;
	}

	let loading = false,
		username = '',
		display_name = '',
		about = '',
		website = '',
		avatar_url = '',
		badges: ProfileBadge[] = [],
		pfpSrc = '';

	const downloadImage = (node: any) => {
		supabase.storage
			.from('avatars')
			.download(`${supabase.auth.user()?.id}.png`)
			.then(({ data, error }) => {
				if (error) throw error;
				pfpSrc = URL.createObjectURL(data as Blob);
			})
			.catch((error) => console.error('Error downloading image: ', error.message));
	};

	onMount(() => {
		user.subscribe((user) => {
			if (!user) {
				window.location.href = '/';
			}
		});

		downloadImage();

		try {
			loading = true;
			const supabaseUser = supabase.auth.user();

			supabase
				.from('profiles')
				.select(`username, display_name, about, website, badges, avatar_url`)
				.eq('id', supabaseUser?.id)
				.single()
				.then(({ data, error, status }) => {
					if (data) {
						({ username, display_name, about, website, badges, avatar_url } = data);
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
			{#if pfpSrc}
				<div class="profile-avatar-wrapper">
					<img src={pfpSrc} alt="Avatar" class="profile-avatar" />
				</div>
			{/if}
			<h1 class="profile-display-name">{display_name}</h1>
			<span class="profile-username">{username ? '@' + username:''}</span>
			<div class="profile-badges">
				{#each badges as badge, i}
					<Tooltip hideIcon>
						<div slot="triggerText">
							<Tag
								style={`background-color: ${badge.color}; color: ${badge.textcolor}`}
								icon={Information}
							>
								{badge.name}
							</Tag>
						</div>
						<p>{badge.description}</p>
					</Tooltip>
				{/each}
			</div>
			<p class="profile-bio">
				{about}
			</p>
			{#if website}
				<div class="profile-website">
					<OutboundLink href={website}>
						{website}
					</OutboundLink>
				</div>
			{/if}
		</div>
		<Tabs class="profile-tabs">
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

		margin: 2rem;

		.profile-avatar-wrapper {
			border-radius: 50%;
			border: 1px solid #aaaaaa;
		}

		.profile-avatar {
			object-fit: contain;
			max-height: 6em;
		}

		.profile-username {
			user-select: none;
			margin: 0.25rem 0 1rem 0;

			color: #bbbbbb;
		}

		.profile-display-name {
			user-select: none;
		}

		.profile-badges {
			display: flex;
			align-items: center;
		}

		.profile-bio {
			padding: 1rem;
			width: min(60%, 300px);
			border-top: 1px solid #525252;
			white-space: pre-line;
			font-size: 14px;
		}
	}

	@media screen and (max-width: 672px) {
		.profile-badges {
			flex-direction: column;
		}
	}
</style>
