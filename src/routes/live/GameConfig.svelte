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
		NumberInput
	} from 'carbon-components-svelte';

	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';

	const roomModes = [
		{
			modeName: 'Classic',
			modeKey: 'classic',
			disabled: false,
			modeDescription: 'The original VO experience; A standard timed problemset'
		},
		{
			modeName: 'Relay',
			modeKey: 'relay',
			disabled: true,
			modeDescription: 'Teams compete in a relay of problems'
		},
		{
			modeName: 'Deathmatch',
			modeKey: 'deathmatch',
			disabled: true,
			modeDescription: 'Teams compete head on in spotlight 1v1s'
		}
	];

	let mode = 'classic', teamsEnabled = false, timeLimit = 60;

	$: (mode || true) && updateRoom();
	$: (timeLimit || true) && updateRoom();

	let debounceTimer: any;

	import { room } from '$lib/sessionStore';
	import { auth, rtdb } from '$lib/firebase';
	import {ref, remove, set, update } from 'firebase/database';

	const updateRoom = () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			try {				
				let updatePromise = [
					update(ref(rtdb, 'rooms/' + $room.roomId), {
						mode,
						teamsEnabled,
						timeLimit
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
		<FormGroup disabled={!$room.isHost} legendText="Gamemode">
			<TileGroup bind:selected={mode}>
				{#each roomModes as { modeName, modeKey, disabled = false, modeDescription }, i}
					<RadioTile light disabled={disabled || !$room.isHost} value={modeKey}>
						<p>{modeName}</p>

						<span>{modeDescription}</span>
					</RadioTile>
				{/each}
			</TileGroup>
		</FormGroup>
		<FormGroup disabled={!$room.isHost} legendText="Game Duration" >
			<NumberInput min={1} max={180} light helperText="Time limit, in minutes (min 1, max 180)" bind:value={timeLimit} />
		</FormGroup>
		<FormGroup disabled legendText="Enable Teams">
			<Toggle bind:toggled={teamsEnabled}>
				<span slot="labelA" style="display: flex; align-items: center;">
					Disabled
					<TooltipIcon
						disabled
						icon={Information}
						style="margin-left: 0.5rem"
						tooltipText="It's every player for themselves!"
						direction="right"
						align="end"
						on:click={(e) => e.preventDefault()}
					/>
				</span>
				<span slot="labelB" style="display: flex; align-items: center;">
					Enabled
					<TooltipIcon
						disabled
						icon={Information}
						style="margin-left: 0.5rem"
						tooltipText="The red and blue teams face off. Players compete for their own team."
						direction="right"
						align="end"
						on:click={(e) => e.preventDefault()}
					/>
				</span>
			</Toggle>
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
