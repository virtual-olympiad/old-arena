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

	import { db, fetchProfile, storage } from '$lib/firebase';
	import { user } from '$lib/sessionStore';
	import { onMount } from 'svelte';

	interface ProfileBadge {
		name: string;
		icon: string;
		color?: string;
		textcolor?: string;
		description: string;
	}

	let username = '',
		display_name = '',
		bio = '',
		website = '',
		badges: ProfileBadge[] = [],
		pfp = '';

	onMount(async ()=> {
		const profile = await fetchProfile($user.user.uid, true);
		if (profile){
			({ username, display_name, badges, pfp, bio, website } = profile);
		}
	});
</script>

<section class="profile-panel">
	<Tile style="height: 100%;">
		<div class="profile-user">
			{#if pfp}
				<img src={pfp} alt="Avatar" class="profile-avatar" />
			{/if}
			<h1 class="profile-display-name">{display_name || username}</h1>
			<span class="profile-username">{username ? '@' + username:''}</span>
			<div class="profile-badges">
				{#if badges?.length}
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
				{/if}
			</div>
			<p class="profile-bio">
				{bio}
			</p>
			{#if website}
				<div class="profile-website">
					<OutboundLink href={website}>
						{website}
					</OutboundLink>
				</div>
			{/if}
		</div>
		<Tabs type="container" class="flex-tabs">
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

		.profile-avatar {
			object-fit: contain;
			height: 6em;
			border-radius: 50%;
			outline: 1px solid #aaaaaa;
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
