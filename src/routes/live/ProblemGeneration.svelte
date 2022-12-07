<script lang="ts">
	import type { RoomMode } from 'src/app';

	import {
		Form,
		FormGroup,
		Checkbox,
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
		Tag,
		RadioTile,
		TileGroup,
		SelectableTile,
		Accordion,
		AccordionItem,
		NumberInput 
	} from 'carbon-components-svelte';

	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';

	const contest = [
		{
			name: 'AMC 8',
			key: 'amc8',
			disabled: false,
			color: 'green',
			difficulty: [1, 1.5],
			description: 'Multiple choice problems for middle schoolers'
		},
		{
			name: 'AMC 10',
			key: 'amc10',
			disabled: false,
			color: 'purple',
			difficulty: [1, 3],
			description: 'Hard multiple choice problems for 9th and 10th graders'
		},
		{
			name: 'AMC 12',
			key: 'amc12',
			disabled: false,
			color: 'magenta',
			difficulty: [2, 4],
			description: 'Harder multiple choice problems for 11th and 12th graders'
		},
		{
			name: 'AIME',
			key: 'aime',
			disabled: false,
			color: 'red',
			difficulty: [3, 6],
			description: 'Very challenging answer based problems for high schoolers'
		},
		{
			name: 'MO',
			key: '',
			disabled: true,
			difficulty: [],
			description: 'Extremely challenging proof based olympiads'
		}
	];

	let contestSelection = {
		amc8: false,
		amc10: false,
		amc12: false,
		aime: false
	};

	let contestDetails = {
		amc8: {
			problemCount: 1,
			correctScore: 6,
			blankScore: 1.5
		},
		amc10: {
			problemCount: 1,
			correctScore: 6,
			blankScore: 1.5
		},
		amc12: {
			problemCount: 1,
			correctScore: 6,
			blankScore: 1.5
		},
		aime: {
			problemCount: 1,
			correctScore: 10,
			blankScore: 0
		}
	};

	let mode = 'classic';
	let teamsEnabled = false;

	// $: (mode || true) && updateRoom();
	$: totalProblems = contest.reduce((prev, { key }) => {
		return prev + (contestSelection[key] ? contestDetails[key]?.problemCount ?? 0 : 0);
	}, 0);

	let debounceTimer: any;

	import { socket } from '$lib/socket.js';
	import { room } from '$lib/sessionStore';
	import { auth, rtdb } from '$lib/firebase';
	import { onValue, ref, remove, set, update } from 'firebase/database';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	onValue(ref(rtdb, 'rooms/' + $room?.roomId), async (snapshot) => {
		if (!snapshot.exists()) {
			if (browser) {
				goto('/');
			}
			return;
		}

		({ mode, teamsEnabled } = snapshot.val());
	});

	/**
	const updateRoom = () => {
		console.log('cleared');
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			console.log('updated');
			try {
				let updatePromise = [
					update(ref(rtdb, 'rooms/' + $room.roomId), {
						mode,
						teamsEnabled
					})
				];

				await Promise.allSettled(updatePromise);
			} catch (error) {
				console.error(error);
			}
		}, 1000);
	}; 
	**/
</script>

<section class="room-panel">
	<Form style="width: clamp(330px, 100%, 466.833px);">
		<FormGroup legendText="Problem Sources">
			<TileGroup bind:selected={mode}>
				{#each contest as { name, key, disabled = false, color, description, difficulty }, i}
					<SelectableTile bind:selected={contestSelection[key]} light {disabled} value={key}>
						<p style="display: flex; align-items: center;">
							{name}
							<Tag style="margin-left: .5rem;" type={color} {disabled}>
								{#if !disabled}
									Difficulty: {difficulty[0]} - {difficulty[1]}
								{:else}
									Coming Soon
								{/if}
							</Tag>
						</p>

						<span>{description}</span>
					</SelectableTile>
				{/each}
			</TileGroup>
		</FormGroup>
		<FormGroup legendText="Problem Distribution">
			<Accordion style="margin-bottom: 1rem;">
				{#each contest as { name, key, disabled = false }, i}
					{#if !disabled}
						<AccordionItem open={contestSelection[key]} disabled = {!contestSelection[key]}>
							<svelte:fragment slot="title">
								<h5>{name}</h5>
								<div>
									{contestSelection[key] ? (contestDetails[key].problemCount ?? 0) : 0} problems
								</div>
							</svelte:fragment>
							<Form style="width: 100%;">
								<FormGroup legendText="Problem Count" >
									<NumberInput min={1} max={25} light size="sm" bind:value={contestDetails[key].problemCount} />
								</FormGroup>
								<FormGroup legendText="Score Calculation" >
									<NumberInput min={1} max={10} helperText="Score value of correct answer" light size="sm" bind:value={contestDetails[key].correctScore} />
									<br />
									<NumberInput min={0} max={10} helperText="Score value of blank answer" light size="sm" bind:value={contestDetails[key].blankScore} />
								</FormGroup>
							</Form>
						</AccordionItem>
					{/if}
				{/each}
			</Accordion>
			<NumberInput readonly label="Total Problems" light value={totalProblems} />
		</FormGroup>
	</Form>
</section>

<style lang="scss">
	.room-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
