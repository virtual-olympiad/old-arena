<script lang="ts">
	import { socket } from '$lib/socket';
	import { room, app } from '$lib/sessionStore';
	import { Link, Tag, Tile, truncate } from 'carbon-components-svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { onValue, ref } from 'firebase/database';
	import { fetchProfile, rtdb } from '$lib/firebase';

	let users: any = [];

	const getUser = async (socketId: string, userId: string) => {
		return {
			...(await fetchProfile(userId, true)),
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
	let elapsed: number, frame: any;

	onMount(() => {
		(function update() {
			frame = requestAnimationFrame(update);

			elapsed = window.performance.now();
		})();

		return ()=> {
			cancelAnimationFrame(frame);
		};
	});

	onDestroy(() => {
		usersSubscription();
	});

	$: cardShadowColor = $app.theme == 'g90' ? '#0160e2' : '#5195f0';
</script>

<section class="users-menu no-select">
	{#each users as user, i}
		<Tile
			light
			style={`width: 100%; display: flex; flex: 0 0 auto; align-items: center; margin: .25rem 0; 
			${
				user.socketId == socket.id
					? `box-shadow: 0 0 ${7 + Math.sin(elapsed/300) * 3}px 1px ${cardShadowColor}`
					: `box-shadow: 0 0 3px 0 ${cardShadowColor}`
			}`}
		>
			<div class="user-avatar-wrapper">
				{#if $room.roomData?.host.userId == user.uid}
					<Tag
						size="sm"
						style="position: absolute; display: block; bottom: -20%; left: 0; right: 0; width: fit-content; margin: auto;"
						type="high-contrast">Host</Tag
					>
				{/if}
				{#if user.pfp}
					<img src={user.pfp} alt="Avatar" class="user-avatar" />
				{/if}
			</div>
			<div class="user-info">
				<div style={`font-size: 16px; max-width: 130px;`} use:truncate>
					{user.display_name}
				</div>

				<div style="color: #bbbbbb; max-width: 130px;" use:truncate>
					@{user.username}
				</div>
			</div>
			<Link style="margin-left: auto;" href={`/profile/${user.uid}`} icon={UserAvatarFilledAlt}
				>Profile</Link
			>
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

		.user-avatar-wrapper {
			flex: 0 0 auto;
			position: relative;
			height: 4em;
			width: 4em;
			outline: 1px solid #aaaaaa;
			border-radius: 50%;

			.user-avatar {
				height: 100%;
				width: 100%;
				border-radius: 50%;
				object-fit: contain;
			}
		}

		.user-info {
			margin: 0 0.5rem 0 1rem;

			> div {
				padding: 0.2rem 0;
			}
		}
	}

	@media screen and (max-width: 1055px) {
		.users-menu {
			height: initial;
			max-height: 200px;
		}
	}
</style>
