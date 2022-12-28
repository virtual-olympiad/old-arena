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
		NumberInput,
		InlineLoading,
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody,
		Dropdown,
		OverflowMenu,
		OverflowMenuItem,
		truncate
	} from 'carbon-components-svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';
	import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import Exit from 'carbon-icons-svelte/lib/Exit.svelte';
	import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
	import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
	import SortAscending from 'carbon-icons-svelte/lib/SortAscending.svelte';
	import SortDescending from 'carbon-icons-svelte/lib/SortDescending.svelte';
	import SortRemove from 'carbon-icons-svelte/lib/SortRemove.svelte';

	let loading = false;

	import { socket } from '$lib/socket.js';
	import { auth, db, rtdb, storage } from '$lib/firebase';
	import { app, user, room } from '$lib/sessionStore';
	import { onValue, ref, update } from 'firebase/database';
	import { getDownloadURL, ref as storageRef } from 'firebase/storage';
	import { doc, getDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { afterUpdate, beforeUpdate, onDestroy, onMount } from 'svelte';
	import UsersMenu from './UsersMenu.svelte';

	let users: any[] = [];
	let problems: any[] = [];

	let timeLimit = 0;
	let startTime = window.performance.now();

	let problemAnswers: any[] = [];
	let savedAnswers: any[] = [];
	let savingAnswers = false;

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
		savingAnswers = true;

		try {
			await update(ref(rtdb, 'gameInfo/' + $room?.roomId + '/responses/' + $user.user.uid), {
				answers: problemAnswers
			});
		} catch (error) {
			console.error(error);
		} finally {
			savingAnswers = false;
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

	onValue(
		ref(rtdb, 'gameInfo/' + $room?.roomId + '/responses/' + $user.user.uid + '/answers'),
		async (snapshot) => {
			if (!snapshot.exists()) {
				return;
			}

			savedAnswers = snapshot.val();
		}
	);

	const saveStatus = (i) => {
		if ((problemAnswers[i] ?? '') == (savedAnswers[i] ?? '')) {
			return 'finished';
		}

		if (savingAnswers) {
			return 'active';
		}

		return 'error';
	};

	const saveDescription = (i) => {
		switch (saveStatus(i)) {
			case 'finished':
				return 'Saved';
			case 'active':
				return 'Saving';
			case 'error':
				return 'Unsaved';
		}
	};

	let currentTime = Date.now();

	let timerTimeout: any;
	const updateTimer = () => {
		timerTimeout = setTimeout(updateTimer, 1000);

		currentTime = Date.now();
	};

	let sortAscending = true;

	onMount(() => {
		updateTimer();

		onValue(
			ref(rtdb, 'gameInfo/' + $room?.roomId + '/gameDetails'),
			async (snapshot) => {
				if (!snapshot.exists() || !snapshot.val().problems) {
					console.error('Error Fetching Problems: No problems in database');
					return;
				}

				({ startTime, timeLimit, problems } = snapshot.val());

				problems = problems.map((problem, i) => {
					return {
						...problem,
						index: i
					};
				});

				problemAnswers = new Array(problems.length).fill('');
			},
			{ onlyOnce: true }
		);
	});

	onDestroy(() => clearTimeout(timerTimeout));

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

	const submitAnswers = () => {};

	let mobileCollapse = false;
	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<section class="game-panel">
	<Tile
		style="width: 100%; height: 100%; display: flex; align-items: center;"
		class="game-panel-tile"
	>
		<section class="details-panel">
			<div class="mobile-collapse">
				<Button
					kind="ghost"
					icon={mobileCollapse ? ChevronDown : ChevronUp}
					iconDescription="Collapse"
					on:click={() => {
						mobileCollapse = !mobileCollapse;
					}}
				/>
			</div>
			{#if innerWidth >= 1280 || !mobileCollapse}
				<h4 class="no-select">{$room.roomInfo?.name}</h4>
				<div class="room-invite">
					<h6 class="no-select">Invite Code:</h6>
					<CodeSnippet light code={$room.roomId} feedbackTimeout={1000} />
				</div>
				<Tabs style="margin-right: 1rem;" selected={1} class="flex-tabs">
					<Tab label="Users" />
					<Tab label="Submission" />
					<svelte:fragment slot="content">
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-bottom: 1rem;">
							<UsersMenu {users} />
						</TabContent>
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-bottom: 1rem;">
							<StructuredList condensed>
								<StructuredListHead>
									<StructuredListRow head>
										<StructuredListCell head>Problem</StructuredListCell>
										<StructuredListCell style="text-align: center;" head
											>Response</StructuredListCell
										>
									</StructuredListRow>
								</StructuredListHead>
								<StructuredListBody>
									{#each problemAnswers as answer, i}
										<StructuredListRow>
											<StructuredListCell noWrap>Problem {i + 1}</StructuredListCell>
											<StructuredListCell style="text-align: center;"
												>{savedAnswers[i]?.toString().toUpperCase() || '-'}</StructuredListCell
											>
										</StructuredListRow>
									{/each}
								</StructuredListBody>
							</StructuredList>
						</TabContent>
					</svelte:fragment>
				</Tabs>
			{/if}
			<ButtonSet stacked={innerWidth >= 1280 || innerWidth < 672} style="justify-content: center;">
				<Button on:click={exitRoom} kind="secondary" disabled={loading} icon={Exit}>
					Exit Room
				</Button>
				<Button on:click={submitAnswers} icon={CaretRight} disabled={loading || !$room.isHost}
					>Submit Answers</Button
				>
			</ButtonSet>
		</section>
		<div class="exam-panel">
			<article class="info-panel no-select">
				<Tile light style="width: 100%; height: 100%; display: flex; align-items: center;">
					<ProgressBar
						value={timeLimit + startTime - currentTime}
						max={timeLimit}
						labelText="Time Remaining"
						helperText={new Date(
							Math.max(0, Math.min(timeLimit, timeLimit + startTime - currentTime))
						)
							.toISOString()
							.slice(11, 19)}
						style="width: 100%;"
					/>
				</Tile>
			</article>
			<section class="problem-panel">
				{#key sortAscending}
					{#each problems as { problem, answerType, index }, i}
						<div class="problem no-select" id={'problem-' + i}>
							<div style="display: flex; align-items: center;">
								<h4 class="problem-title" use:truncate>
									Problem {index + 1}
								</h4>
								{#key savingAnswers ? problemAnswers[index] : null}
									{#key savedAnswers[index]}
										<InlineLoading
											status={saveStatus(index)}
											description={saveDescription(index)}
											style="padding: 0 1rem; width: fit-content"
										/>
									{/key}
								{/key}
								{#if i == 0}
									<Button
										icon={sortAscending ? SortAscending : SortDescending}
										kind="ghost"
										size="field"
										on:click={() => {
											sortAscending = !sortAscending;
											problems.reverse();
										}}
										style="margin-left: auto;"
									>
										{sortAscending ? 'Sort: Difficulty Ascending' : 'Sort: Difficulty Descending'}
									</Button>
								{/if}
							</div>
							<div class="problem-container">
								{@html problem}
							</div>
							<div class="answer-container">
								{#if answerType == 'amc'}
									<RadioButtonGroup
										legendText="Multiple Choice"
										bind:selected={problemAnswers[index]}
									>
										<RadioButton value="">
											<span slot="labelText" style="font-size: 16px; font-weight: 400;"> - </span>
										</RadioButton>
										{#each ['a', 'b', 'c', 'd', 'e'] as choice, j}
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
										bind:value={problemAnswers[index]}
									/>
								{/if}
							</div>
						</div>
					{/each}
				{/key}
			</section>
		</div>
	</Tile>
</section>

<style lang="scss">
	@import 'src/variables.scss';

	.game-panel {
		width: min(100%, 1312px);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		.details-panel {
			position: relative;
			display: flex;
			flex: 1 0 0;
			max-width: 480px;
			min-height: 48px;
			height: 100%;
			border-right: 1px solid #525252;

			display: flex;
			flex-direction: column;
			align-items: center;

			.mobile-collapse {
				display: none;
				position: absolute;
				top: 0;
				right: 0;
			}

			.room-details {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.room-invite {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 1rem 0;
			}

			.user-avatar {
				object-fit: contain;
				height: 4em;
				border-radius: 50%;
				outline: 1px solid #aaaaaa;
			}
		}

		.exam-panel {
			flex: 2.5 0 0;

			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;

			.info-panel {
				width: 100%;

				display: flex;
				align-items: center;
				border-bottom: 1px solid #525252;
			}
		}

		.problem-panel {
			flex: 2 0 0;
			max-width: 100%;
			overflow-y: auto;
			padding-left: 1rem;

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

				.answer-container {
					overflow-x: auto;
				}
			}
		}
	}

	@media screen and (min-width: 1056px) {
	}

	@media screen and (max-width: 1279px) {
		.game-panel {
			.details-panel {
				flex: 0 0 auto;
				height: initial;
				width: 100%;
				max-width: initial;
				border-right: none;

				margin-bottom: 1rem;

				.mobile-collapse {
					display: block;
				}
			}

			.exam-panel {
				max-width: 100%;
			}
		}
	}
</style>
