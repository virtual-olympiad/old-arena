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
		ProgressBar,
		NumberInput
	} from 'carbon-components-svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import Exit from 'carbon-icons-svelte/lib/Exit.svelte';

	let loading = false;

	import { socket } from '$lib/socket.js';
	import { auth, db, rtdb, storage } from '$lib/firebase';
	import { app, user, room } from '$lib/sessionStore';
	import { onValue, ref, update } from 'firebase/database';
	import { getDownloadURL, ref as storageRef } from 'firebase/storage';
	import { doc, getDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { afterUpdate, beforeUpdate } from 'svelte';

	let users: any[] = [];
	let problems: any[] = [];
	let problemAnswers: any[] = [];

	$: (problemAnswers || true) && updateAnswers();

	const updateKatexTheme = () => {
		if (browser) {
			if ($app.theme == 'g90') {
				document.querySelectorAll('.latex, .latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', 'filter: invert(1);');
				});
			} else {
				document.querySelectorAll('.latex, .latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', '');
				});
			}
		}
	};

	afterUpdate(updateKatexTheme);

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

	const updateAnswers = async () => {
		console.log(problemAnswers);
		try {
			await update(ref(rtdb, 'gameInfo/' + $room?.roomId + '/responses/' + $user.user.uid), {
				answers: problemAnswers
			});
		} catch (error) {
			console.error(error);
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

	onValue(
		ref(rtdb, 'gameInfo/' + $room?.roomId + '/responses/' + $user.uid + '/answers'),
		async (snapshot) => {
			if (!snapshot.exists()) {
				return;
			}

			if (problems.length > 0) {
				problemAnswers = snapshot.val();
			}
		}
	);

	onValue(
		ref(rtdb, 'gameInfo/' + $room?.roomId + '/problems'),
		async (snapshot) => {
			if (!snapshot.exists()) {
				console.error('Error Fetching Problems: No problems in database');
				return;
			}

			problems = snapshot.val();
			problemAnswers = new Array(problems.length).fill('');
		},
		{ onlyOnce: true }
	);

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

<section class="problem-panel">
	<Tile
		style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow-y: auto;"
		class="live-panel-tile"
	>
		{#each problems as { problem, title, answerType }, i}
			<div class="problem" id={'problem-' + i}>
				<h4 class="problem-title">{title} <!--Problem {i + 1}--></h4>
				<div class="problem-container">
					{@html problem}
				</div>

				{#if answerType == 'amc'}
					<RadioButtonGroup
						legendText="Multiple Choice"
						class="no-select"
						bind:selected={problemAnswers[i]}
					>
						<RadioButton value="">
							<span slot="labelText" style="font-size: 16px; font-weight: 400;"> - </span>
						</RadioButton>
						{#each ['a', 'b', 'c', 'd', 'e'] as choice, i}
							<RadioButton value={choice}>
								<span slot="labelText" style="font-size: 16px; font-weight: 400;">
									{choice.toUpperCase()}
								</span>
							</RadioButton>
						{/each}
					</RadioButtonGroup>
				{:else if answerType == 'aime'}
					<NumberInput
						allowEmpty
						hideSteppers
						light
						size="sm"
						label="Integer Answer"
						min={0}
						max={999}
						bind:value={problemAnswers[i]}
					/>
				{/if}
			</div>
		{/each}
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.problem-panel {
		width: min(100%, 1080px);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		.problem {
			width: 100%;
			padding: 1rem 0.5rem;
			display: flex;
			flex-direction: column;
			border-bottom: 1px dotted #999;

			.problem-title {
				font-weight: 500;
			}

			.problem-container {
				height: 100%;
				overflow-x: auto;
				padding: 1rem 0;
				margin: 0 0 0.5rem 0;
			}
		}
	}

	@media screen and (min-width: 1056px) {
	}

	@media screen and (max-width: 1055px) {
	}
</style>
