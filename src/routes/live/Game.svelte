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
	import { onValue, ref } from 'firebase/database';
	import { getDownloadURL, ref as storageRef } from 'firebase/storage';
	import { doc, getDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let users: any = [];
    let problems: any = [];

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
			console.log(users);
		} catch (error) {
			console.error(error);
		}
	});

	onValue(ref(rtdb, 'roomUsers/' + $room?.roomId + '/problems'), async (snapshot) => {
		if (!snapshot.exists()) {
			problems = [];
			return;
		}

		problems = snapshot.val();
        console.log(problems);
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
</script>

<section class="lobby-panel">
    <Tile
        style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;"
        class="live-panel-tile"
    >
        {#each problems as { problem }, i}
            {@html problem}
        {/each}
    </Tile>
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
