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
	import ResultNew from 'carbon-icons-svelte/lib/ResultNew.svelte';

	let loading = false;

	import { socket } from '$lib/socket.js';
	import { auth, db, fetchProfile, rtdb, storage } from '$lib/firebase';
	import { app, user, room } from '$lib/sessionStore';
	import { onValue, ref, update } from 'firebase/database';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { afterUpdate, beforeUpdate, onDestroy, onMount } from 'svelte';
	import UsersMenu from './UsersMenu.svelte';
	import Problems from './Problems.svelte';
	import Solutions from './Solutions.svelte';

	let problems: any[] = [];

	let timeLimit = 0;
	let startTime = window.performance.now();

	let problemAnswers: any[] = [];
	let savedAnswers: any[] = [];
	let savingAnswers = false;

	$: (problemAnswers || true) && updateAnswers();

	const updateAnswers = async () => {
		if (!problemAnswers.length){
			return;
		}

		savingAnswers = true;

		try {
			await update(ref(rtdb, 'gameData/' + $room?.roomId + '/responses/' + $user.user.uid), {
				answers: problemAnswers
			});
		} catch (error) {
			console.error(error);
		} finally {
			savingAnswers = false;
		}
	};

	const answersListener = onValue(
		ref(rtdb, 'gameData/' + $room?.roomId + '/responses/' + $user.user.uid + '/answers'),
		async (snapshot) => {
			if (!snapshot.exists()) {
				return;
			}

			savedAnswers = snapshot.val();
		}
	);

	let currentTime = Date.now();

	let timerTimeout: any;
	const updateTimer = () => {
		timerTimeout = setTimeout(updateTimer, 1000);

		currentTime = Date.now();
	};

	onMount(() => {
		updateTimer();

		// Check if answers saved from previous join
		onValue(
			ref(rtdb, 'gameData/' + $room?.roomId + '/responses/' + $user.user.uid + '/answers'),
			async (snapshot) => {
				if (!snapshot.exists()) {
					return;
				}

				problemAnswers = snapshot.val();
			},
			{ onlyOnce: true }
		);

		// Initialize <Game>
		onValue(
			ref(rtdb, 'gameData/' + $room?.roomId + '/data'),
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

				if (!problemAnswers.length){
					problemAnswers = new Array(problems.length).fill('');
				}
			},
			{ onlyOnce: true }
		);
	});

	onDestroy(() => {
		clearTimeout(timerTimeout);
		answersListener();
	});

	let submitted = false;
	let solutions: any[] = [];
	let contestData: any;

	const updateSubmission = () => {
		submitted = true;
		clearTimeout(timerTimeout);

		onValue(
			ref(rtdb, 'gameData/' + $room?.roomId + '/results/answers'),
			async (snapshot) => {
				if (!snapshot.exists()) {
					console.error('Error Fetching Answers: No answers in database');
					return;
				}

				solutions = snapshot.val();
			},
			{ onlyOnce: true }
		);

		onValue(
			ref(rtdb, 'gameSettings/' + $room?.roomId + '/contestData'),
			async (snapshot) => {
				if (!snapshot.exists()) {
					return;
				}

				contestData = snapshot.val();
			},
			{ onlyOnce: true }
		);
	};

	socket.on('submit-answer-success', updateSubmission);

	let standings: any[], endReason: any, problemsPanel: HTMLElement;

	const getStandingsProfile = async (user: any) => {
		const profile = await fetchProfile(user.userId, false);

		if (!profile) {
			return;
		}

		const { username, display_name } = profile;

		return {
			...user,
			username,
			display_name
		};
	};

	socket.on('results-compiled', () => {
		onValue(
			ref(rtdb, 'gameData/' + $room?.roomId + '/results'),
			async (snapshot) => {
				if (!snapshot.exists()) {
					return;
				}

				({ standings, endReason } = snapshot.val());

				const profiles = await Promise.allSettled(
					standings.map((user) => {
						return getStandingsProfile(user);
					})
				);

				standings = profiles.map((user, i) => {
					if (user.status != 'fulfilled') {
						console.error('Could not fetch UID: ' + standings[i].userId);
						return;
					}

					return user.value;
				});

				problemsPanel.scroll({ top: 0, behavior: 'smooth' });
			},
			{ onlyOnce: true }
		);
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

	const returnLobby = async () => {
		$room.gameState = 'lobby';
	};

	const submitAnswers = async () => {
		if (loading) return;

		try {
			loading = true;
			let idToken = await auth.currentUser?.getIdToken(true);

			socket.emit('submit-answer', {
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

	const isCorrect = (response: string | number, solution: any) => {
		return (Array.isArray(solution) && solution.includes(response)) || solution === response;
	};

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
				<h4 class="no-select">{$room.roomData?.name}</h4>
				<div class="room-invite">
					<h6 class="no-select">Invite Code:</h6>
					<CodeSnippet light code={$room.roomId} feedbackTimeout={1000} />
				</div>
				<Tabs style="margin-right: 1rem;" selected={1} class="flex-tabs">
					<Tab label="Users" />
					<Tab label="Submission" />
					<svelte:fragment slot="content">
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-bottom: 1rem;">
							<UsersMenu />
						</TabContent>
						<TabContent style="overflow: auto; width: 100%; height: 100%; margin-bottom: 1rem;">
							<StructuredList condensed>
								<StructuredListHead>
									<StructuredListRow head>
										<StructuredListCell head>Problem</StructuredListCell>
										<StructuredListCell style="text-align: center;" head
											>Response</StructuredListCell
										>
										{#if submitted}
											<StructuredListCell style="text-align: center;" head
												>Answer</StructuredListCell
											>
											<StructuredListCell style="text-align: center;" head>Score</StructuredListCell
											>
										{/if}
									</StructuredListRow>
								</StructuredListHead>
								<StructuredListBody>
									{#each problemAnswers as answer, i}
										<StructuredListRow>
											<StructuredListCell noWrap>#{i + 1}</StructuredListCell>
											<StructuredListCell style="text-align: center;"
												>{savedAnswers[i]?.toString().toUpperCase() || '-'}</StructuredListCell
											>
											{#if submitted}
												<StructuredListCell style="text-align: center;">
													{solutions[i]?.answer?.toString().toUpperCase()}
												</StructuredListCell>
												<StructuredListCell style="text-align: center;">
													{#if savedAnswers[i] || savedAnswers[i] === 0}
														{isCorrect(savedAnswers[i], solutions?.[i]?.answer)
															? contestData?.[solutions?.[i]?.contest]?.correctScore
															: 0}
													{:else}
														{contestData?.[solutions?.[i]?.contest]?.blankScore}
													{/if}
												</StructuredListCell>
											{/if}
										</StructuredListRow>
									{/each}
								</StructuredListBody>
							</StructuredList>
						</TabContent>
					</svelte:fragment>
				</Tabs>
			{/if}
			<ButtonSet stacked={innerWidth >= 1280 || innerWidth < 672} style="justify-content: center;">
				{#if endReason}
					<Button on:click={returnLobby} kind="secondary" disabled={loading} icon={Exit}>
						Return to Lobby
					</Button>
					<Button
						on:click={() => {
							problemsPanel.scroll({ top: 0, behavior: 'smooth' });
						}}
						icon={ResultNew}>View Standings</Button
					>
				{:else}
					<Button on:click={exitRoom} kind="secondary" disabled={loading} icon={Exit}>
						Exit Room
					</Button>
					<Button on:click={submitAnswers} icon={CaretRight} disabled={loading || submitted}
						>Submit Answers</Button
					>
				{/if}
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
			<section bind:this={problemsPanel} class="problem-panel">
				{#if endReason}
					<section class="standings">
						<h4 style="align-self: center;">
							{endReason == 'end-time' ? "Time's Up" : "Everyone's Submitted!"}
						</h4>
						<div style="max-width: 100%; overflow-x: auto;" class="table-wrapper">
							<StructuredList style="margin-bottom: 0;">
								<StructuredListHead>
									<StructuredListRow head>
										<StructuredListCell head>Rank</StructuredListCell>
										<StructuredListCell style="text-align: center;" head>User</StructuredListCell>
										<StructuredListCell style="text-align: center;" head>Correct</StructuredListCell
										>
										<StructuredListCell style="text-align: center;" head>Blank</StructuredListCell>
										<StructuredListCell style="text-align: center;" head
											>Time Used</StructuredListCell
										>
										<StructuredListCell style="text-align: center;" head>Score</StructuredListCell>
									</StructuredListRow>
								</StructuredListHead>
								<StructuredListBody>
									{#each standings as { blank, correct, score, timeUsed, userId, username, display_name }, i}
										<StructuredListRow>
											<StructuredListCell noWrap>#{i + 1}</StructuredListCell>
											<StructuredListCell style="text-align: center;"
												><div style="display: flex; flex-direction: column;" use:truncate>
													<span>{display_name}</span>
													<span>@{username}</span>
												</div></StructuredListCell
											>
											<StructuredListCell style="text-align: center;" noWrap
												>{correct}</StructuredListCell
											>
											<StructuredListCell style="text-align: center;" noWrap
												>{blank}</StructuredListCell
											>
											<StructuredListCell style="text-align: center;" noWrap
												>{(timeUsed / 60000).toFixed(1)} mins</StructuredListCell
											>
											<StructuredListCell style="text-align: center;" noWrap
												>{score}</StructuredListCell
											>
										</StructuredListRow>
									{/each}
								</StructuredListBody>
							</StructuredList>
						</div>
					</section>
				{/if}
				{#if !submitted}
					<Problems {problems} {savingAnswers} {savedAnswers} bind:problemAnswers />
				{:else}
					<Solutions {solutions} {savedAnswers} />
				{/if}
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

			.standings {
				width: 100%;
				padding: 1rem 0.5rem;
				display: flex;
				flex-direction: column;
			}
		}
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

			.problem-panel {
				padding-left: 0;

				.standings {
					padding: 1rem 0;
				}
			}
		}
	}
</style>
