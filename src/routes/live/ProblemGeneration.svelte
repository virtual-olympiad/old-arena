<script lang="ts">
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
			description: 'Challenging answer based problems for high schoolers'
		},
		{
			name: 'MO',
			key: 'mo',
			disabled: true,
			difficulty: [],
			description: 'Extremely challenging proof based olympiads'
		}
	];

	let contestSelection = {
		amc8: true,
		amc10: true,
		amc12: true,
		aime: true
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


	$: (contestSelection || true) && updateRoom();
	$: (contestDetails || true) && updateRoom();
	$: totalProblems = contest.reduce((prev, { key }) => {
		return prev + (contestSelection[key] ? contestDetails[key]?.problemCount ?? 0 : 0);
	}, 0);

	let debounceTimer: any;

	import { room } from '$lib/sessionStore';
	import { auth, rtdb } from '$lib/firebase';
	import { onValue, ref, remove, set, update } from 'firebase/database';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	onValue(ref(rtdb, 'gameSettings/' + $room?.roomId), async (snapshot) => {
		if (!snapshot.exists()) {
			if (browser) {
				goto('/');
			}
			return;
		}

		({ contestSelection, contestDetails } = snapshot.val());
	});


	const updateRoom = () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			try {
				console.log(contestDetails, contestSelection);
				let updatePromise = [
					update(ref(rtdb, 'gameSettings/' + $room.roomId), {
						contestSelection,
						contestDetails
					})
				];

				await Promise.allSettled(updatePromise);
			} catch (error) {
				console.error(error);
			}
		}, 500);
	}; 
</script>

<section class="room-panel">
	<Form style="width: clamp(330px, 100%, 466.833px);">
		<FormGroup disabled={!$room.isHost} legendText="Problem Sources">
			<TileGroup>
				{#each contest as { name, key, disabled = false, color, description, difficulty }, i}
					{#if !disabled}
						<SelectableTile disabled={!$room.isHost} bind:selected={contestSelection[key]} light value={key}>
							<p style="display: flex; align-items: center;">
								{name}
								<Tag disabled={!$room.isHost} style="margin-left: .5rem;" type={color}>
									{#if !disabled}
										Difficulty: {difficulty[0]} - {difficulty[1]}
									{:else}
										Coming Soon
									{/if}
								</Tag>
							</p>

							<span>{description}</span>
						</SelectableTile>
					{:else}
						<SelectableTile light {disabled} value={key}>
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
					{/if}
				{/each}
			</TileGroup>
		</FormGroup>
		<FormGroup disabled={!$room.isHost} legendText="Problem Distribution">
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
								<FormGroup legendText="Problem Count (max 25)" >
									<NumberInput min={1} max={25} light size="sm" bind:value={contestDetails[key].problemCount} />
								</FormGroup>
								<FormGroup legendText="Score Calculation" >
									<NumberInput min={1} max={10} helperText="Score value of correct answer (min 1, max 10)" light size="sm" bind:value={contestDetails[key].correctScore} />
									<br />
									<NumberInput min={0} max={10} helperText="Score value of blank answer (min 0, max 10)" light size="sm" bind:value={contestDetails[key].blankScore} />
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
