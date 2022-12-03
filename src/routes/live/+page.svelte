<script lang="ts">
	import type { RoomMode } from 'src/app';

	import {
		Form,
		FormGroup,
		Checkbox,
		CodeSnippet,
		RadioButtonGroup,
		RadioButton,
		Select,
		SelectItem,
		Button,
		Tile,
		Toggle,
		Tooltip,
		TooltipDefinition,
		TooltipIcon,
		TextInput,
		TextArea,
		Tab,
		Tabs,
		TabContent,
		OutboundLink,
		Link,
		Tag
	} from 'carbon-components-svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	const roomModes = ['Standard', 'Relay', 'Showdown'];
	let roomName = "Mango's room",
		roomDescription = '',
		roomMode: RoomMode = 'standard',
		roomPublic = true,
		loading = false;

	import { socket } from '$lib/socket.js';
	import { auth, db, rtdb, storage } from '$lib/firebase';
	import { user, room } from '$lib/sessionStore';
	import RoomSettings from './RoomSettings.svelte';
	import GameConfig from './GameConfig.svelte';
	import ProblemGeneration from './ProblemGeneration.svelte';
	import { onValue, ref } from 'firebase/database';
	import { getDownloadURL, ref as storageRef } from 'firebase/storage';
	import { doc, getDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let users: any = [];

	const downloadImage = async (uid: string) => {
		let pfpLink = '';
		try {
			pfpLink = await getDownloadURL(storageRef(storage, `pfp/${uid}/pfp`));
		} catch (error) {
			console.error(error);
			pfpLink = '';
		}

		return pfpLink;
	};

	const fetchProfile = async (socketId: string, uid: string) => {
		if (!uid) {
			return;
		}

		let display_name = '',
			username = '',
			badges = [],
			pfp = '';

		try {
			pfp = await downloadImage(uid);

			const [{ value: profileSnap }, { value: userSnap }, { value: achievementSnap }] =
				await Promise.allSettled([
					await getDoc(doc(db, 'users', uid, 'public/profile')),
					await getDoc(doc(db, 'users', uid)),
					await getDoc(doc(db, 'users', uid, 'public/achievements'))
				]);

			if (profileSnap.exists()) {
				({ display_name = '' } = profileSnap.data());
			}
			if (userSnap.exists()) {
				({ username = '' } = userSnap.data());
			}
			if (achievementSnap.exists()) {
				({ badges = [] } = userSnap.data());
			}
		} catch (error) {
			console.error(error);
		} finally {
			return {
				socketId,
				uid,
				pfp,
				display_name,
				username,
				badges
			};
		}
	};

	if (!$room?.roomId){
		if (browser){
			goto('/');
		}
	}

	onValue(ref(rtdb, 'rooms/' + $room?.roomId), async (snapshot) => {
		if (!snapshot.exists()) {
			if (browser){
				goto('/');
			}
			
			users = [];
			room.set({
				...$room,
				roomInfo: null
			});
			return;
		}

		room.set({
			...$room,
			roomInfo: snapshot.val()
		});
	});

	onValue(ref(rtdb, 'rooms/' + $room?.roomId + '/users'), async (snapshot) => {
		if (!snapshot.exists()) {
			users = [];
			return;
		}

		try {
			users = (
				await Promise.allSettled(
					Object.entries(snapshot.val()).map(([socketId, user]) => {
						return fetchProfile(socketId, user.userId);
					})
				)
			).map((user) => user.value);
			console.log(users);
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="live-panel">
	<Tile
		style="width: 100%; height: 100%; display: flex; align-items: center;"
		class="live-panel-tile"
	>
		<section class="users-panel">
			<h4>{$room.roomInfo?.name}</h4>
			<div class="room-invite">
				<h6>Invite Code:</h6>
				<CodeSnippet light code={$room.roomId} feedbackTimeout={1000} />
			</div>
			<section class="users-menu">
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
									style={`user-select: none; font-size: 16px; ${
										$room.roomInfo.host.userId == user.uid ? '' : 'margin-bottom: .25rem;'
									}`}
								>
									{user.display_name}
									{#if $room.roomInfo?.host.userId == user.uid}
										<Tag type="high-contrast">Host</Tag>
									{/if}
								</div>

								<div style="user-select: none; color: #bbbbbb;">
									@{user.username}
								</div>
							</div>
						</div>
						<Link href={`/profile/${user.uid}`} icon={UserAvatarFilledAlt}>Profile</Link>
					</Tile>
				{/each}
			</section>
			<Button icon={CaretRight}>Start Game</Button>
		</section>

		<section class="settings-panel">
			<Tabs class="flex-tabs">
				<Tab label="Room" />
				<Tab label="Game" />
				<Tab label="Problemset" />
				<svelte:fragment slot="content">
					<TabContent style="width: 100%; height: 100%; flex: 1 0 auto;" class="centered-tab">
						<RoomSettings />
					</TabContent>
					<TabContent class="centered-tab">
						<GameConfig />
					</TabContent>
					<TabContent class="centered-tab">
						<ProblemGeneration />
					</TabContent>
				</svelte:fragment>
			</Tabs>
		</section>
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.live-panel {
		width: min(100%, 1080px);
		height: 100%;

		.users-panel {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.users-menu {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;
				height: 100%;
				padding: 0.5rem;
				margin: 0.5rem 0;
				overflow: auto;

				.user-avatar {
					object-fit: contain;
					height: 4em;
					border-radius: 50%;
					outline: 1px solid #aaaaaa;
				}
			}

			.room-invite {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 1rem 0;
			}
		}

		
	}

	@media screen and (min-width: 1056px) {
		.users-panel {
			min-width: 336px;
			border-right: 1px solid #525252;
			height: 100%;
			flex: 2 0 0;
		}

		.settings-panel {
			height: 100%;
			flex: 3 0 0;
		}
	}

	@media screen and (max-width: 1055px) {
		.users-panel {
			min-height: 300px;
			flex: 0 1 auto;
			width: clamp(336px, 80%, 500px);
			margin: 1rem 0;
		}

		.settings-panel {
			width: 100%;
			flex: 0 0 auto;
		}
	}
</style>
