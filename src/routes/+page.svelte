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
		OutboundLink,
		Button,
		ButtonSet,
		Link
	} from 'carbon-components-svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import SearchAdvanced from 'carbon-icons-svelte/lib/SearchAdvanced.svelte';
	import EarthFilled from 'carbon-icons-svelte/lib/EarthFilled.svelte';
	import Help from 'carbon-icons-svelte/lib/Help.svelte';

	import LogoInstagram from 'carbon-icons-svelte/lib/LogoInstagram.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
	import LogoYoutube from 'carbon-icons-svelte/lib/LogoYoutube.svelte';

	import { app, user } from '$lib/sessionStore';
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
		<OutboundLink href="https://discord.gg/3eXC9UE6rT">Math et al Discord</OutboundLink>, an active
		community of 200+ members. Participate in weekly events, discuss STEM with peers and find others
		to play VOLY with!
	</p>
</Modal>

<svelte:window bind:innerWidth />
<section class="no-select">
	<div class="notice">
		<a href="/donate" class="notice-label bx--label">COMMUNITY NOTICE</a>
		<InlineNotification
			lowContrast
			kind="info"
			title="Join our Discord:"
			subtitle="Don't miss out on regularly hosted events, POTW, groupsolves, and more!"
			style="flex-shrink: 0; align-items: center; margin: 0; margin-bottom: .5rem;"
			hideCloseButton
		>
			<svelte:fragment slot="actions">
				<NotificationActionButton href="https://discord.gg/3eXC9UE6rT"
					>Join Now</NotificationActionButton
				>
			</svelte:fragment>
		</InlineNotification>
	</div>
	<ContentSwitcher
		style="margin: .5rem 0; max-width: 1311px;"
		bind:selectedIndex={tabIndex}
		size="xl"
	>
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
	<Tile style={`border-radius: .25rem; max-height: 671px; max-width: 1311px;`} class="home-content">
		{#if tabIndex === 0}
			<CreatePanel />
		{:else if tabIndex === 1}
			<JoinPanel />
		{:else if tabIndex === 2}
			<ContestPanel />
		{/if}
	</Tile>
	<footer>
		<Button target="_blank" href="https://discord.gg/3eXC9UE6rT" icon={LogoDiscord} kind="ghost" />
		<Button target="_blank" href="https://github.com/Math-et-al" icon={LogoGithub} kind="ghost" />
		<div style="margin: 0 1rem;">
			2022-{new Date().getFullYear()} © MATH ET AL
		</div>
		<Button
			target="_blank"
			href="https://www.instagram.com/math_et_al"
			icon={LogoInstagram}
			kind="ghost"
		/>
		<Button
			target="_blank"
			href="https://www.youtube.com/@math_et_al"
			icon={LogoYoutube}
			kind="ghost"
		/>
	</footer>
</section>

<style lang="scss">
	@import '../variables.scss';

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 48px;

		width: 100%;
		height: 100%;
	}

	.notice {
		.notice-label {
			position: relative;

			&::after {
				content: '';
				position: absolute;
				width: 100%;
				transform: scaleX(0);
				height: 2px;
				bottom: 0;
				left: 0;
				background-color: var(--cds-text-02);
				transform-origin: bottom right;
				transition: transform 0.25s ease-out;
			}

			&:hover {
				cursor: pointer;

				&::after {
					transform: scaleX(1);
					transform-origin: bottom left;
				}
			}
		}
	}

	footer {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		margin: 0.25rem 1rem;
		margin-top: auto;

		border-top: 1px dotted #525252;
	}

	@media (max-width: 671px), (max-height: 719px) {
		.notice {
			display: none;
		}

		section {
			margin-bottom: initial;
		}

		footer {
			display: none;
		}
	}
</style>
