<script lang="ts">
	import { socket } from '$lib/socket';
	import { room } from '$lib/sessionStore';
	import { Link, Tag, Tile } from 'carbon-components-svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	export let users: any;
</script>

<section class="users-menu no-select">
	{#each users as user, i}
		<Tile
			light
			style={`width: 100%; display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; margin: .25rem 0; ${
				user.socketId == socket.id
					? 'box-shadow: 0 0 10px 1px #0160e2'
					: 'box-shadow: 0 0 5px 0 #0160e2'
			}`}
		>
			<div
				style={`display: flex; align-items: ${
					$room.roomInfo.host.userId == user.uid ? 'flex-start' : 'center'
				};`}
			>
				{#if user.pfp}
					<img src={user.pfp} alt="Avatar" class="user-avatar" />
				{/if}
				<div style="margin: 0 .5rem 0 1rem;">
					<div
						style={`font-size: 16px; ${
							$room.roomInfo.host.userId == user.uid ? '' : 'margin-bottom: .25rem;'
						}`}
					>
						{user.display_name}
						{#if $room.roomInfo?.host.userId == user.uid}
							<Tag type="high-contrast">Host</Tag>
						{/if}
					</div>

					<div style="color: #bbbbbb;">
						@{user.username}
					</div>
				</div>
			</div>
			<Link href={`/profile/${user.uid}`} icon={UserAvatarFilledAlt}>Profile</Link>
		</Tile>
	{/each}
</section>

<style lang="scss">
	.users-menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		overflow: auto;

		.user-avatar {
			object-fit: contain;
			height: 4em;
			border-radius: 50%;
			outline: 1px solid #aaaaaa;
		}
	}

	@media screen and (max-width: 1055px) {
		.users-menu {
			height: initial;
			max-height: 200px;
		}
	}
</style>
