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
		Tag,
		ButtonSet,
		ProgressBar
	} from 'carbon-components-svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import Exit from 'carbon-icons-svelte/lib/Exit.svelte';

	let loading = false;

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
	import UsersMenu from './UsersMenu.svelte';

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
		} catch (error) {
			console.error(error);
		}
	});

	const exitRoom = async () => {
		if (loading) return;

		try {
			loading = true;
			let idToken = await auth.currentUser?.getIdToken(true);

			socket.emit('exit-room', {
				idToken
			});

			goto('/');
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	const startGame = async () => {
		if (loading) return;

		try {
			loading = true;
			let idToken = await auth.currentUser?.getIdToken(true);

			socket.emit('start-game', {
				idToken,
				data: {
					roomId: $room.roomId
				}
			});
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	socket.on('starting-game', ()=> {
		startingGame = true;
	});

	let startingGame = false;
	let innerWidth:number;
</script>

<svelte:window bind:innerWidth />

<section class="lobby-panel" style={startingGame ? "margin: 1rem;":""}>
	{#if startingGame}
		<ProgressBar
			style="width: min(672px, 100%)"
			labelText="Loading Game"
			helperText="Generating Problems..."
		/>
	{:else}
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
				<UsersMenu {users} />
				<ButtonSet stacked={innerWidth <= 671} style="justify-content: center; margin-top: .5rem;">
					<Button on:click={exitRoom} kind="secondary" icon={Exit} disabled={loading}>Exit Room</Button>
					<Button on:click={startGame} icon={CaretRight} disabled={loading || !$room.isHost}>Start Game</Button>
				</ButtonSet>
			</section>

			<section class="settings-panel">
				<Tabs type="container" class="flex-tabs">
					<Tab label="Room" />
					<Tab label="Game" />
					<Tab label="Problemset" />
					<svelte:fragment slot="content">
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-top: .5rem;">
							<RoomSettings />
						</TabContent>
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-top: .5rem;">
							<GameConfig />
						</TabContent>
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-top: .5rem;">
							<ProblemGeneration />
						</TabContent>
					</svelte:fragment>
				</Tabs>
			</section>
		</Tile>
	{/if}
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.lobby-panel {
		width: min(100%, 1080px);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		.users-panel {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.room-invite {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 1rem 0;
			}
		}

		.settings-panel {
			display: flex;
			flex-direction: column;
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
			flex: 0 0 auto;
			width: clamp(336px, 80%, 500px);
			margin: 1rem 0;
		}

		.settings-panel {
			width: 100%;
			flex: 0 0 auto;
		}
	}
</style>
