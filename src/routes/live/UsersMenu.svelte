<script lang="ts">
	import { socket } from '$lib/socket';
	import { room, app } from '$lib/sessionStore';
	import { Link, Tag, Tile, truncate } from 'carbon-components-svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import { onDestroy } from 'svelte';
	import { onValue, ref } from 'firebase/database';
	import { fetchProfile, rtdb } from '$lib/firebase';

	let users: any = [];

	const getUser = async (socketId: string, userId: string) => {
		return {
			...await fetchProfile(userId, true),
			socketId
		};
	};

	const usersSubscription = onValue(
		ref(rtdb, 'rooms/' + $room?.roomId + '/users'),
		async (snapshot) => {
			if (!snapshot.exists()) {
				users = [];
				return;
			}

			try {
				const usersSnap = await Promise.allSettled(
					Object.entries(snapshot.val()).map(([socketId, { userId }]) => getUser(socketId, userId))
				);

				users = usersSnap.flatMap((user) => {
					if (user.status != 'fulfilled') {
						return [];
					}

					return [user.value];
				});
			} catch (error) {
				console.error(error);
			}
		}
	);

	onDestroy(usersSubscription);

	$: cardShadowColor = $app.theme == 'g90' ? "#0160e2":"#5195f0";
</script>

<section class="users-menu no-select">
	{#each users as user, i}
		<Tile
			light
			style={`width: 100%; display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; overflow-x: auto; margin: .25rem 0; ${
				user.socketId == socket.id
					? `box-shadow: 0 0 10px 1px ${cardShadowColor}`
					: `box-shadow: 0 0 5px 0 ${cardShadowColor}`
			}`}
		>
			<div
				style={`display: flex; align-items: ${
					$room.roomData.host.userId == user.uid ? 'flex-start' : 'center'
				};`}
			>
				{#if user.pfp}
					<img src={user.pfp} alt="Avatar" class="user-avatar" />
				{/if}
				<div style="margin: 0 .5rem 0 1rem;">
					<div
						style={`font-size: 16px; ${
							$room.roomData.host.userId == user.uid ? '' : 'margin-bottom: .25rem;'
						}`}
						use:truncate
					>
						{user.display_name}
						{#if $room.roomData?.host.userId == user.uid}
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
