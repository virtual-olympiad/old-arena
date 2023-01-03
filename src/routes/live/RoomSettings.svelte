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
		Slider
	} from 'carbon-components-svelte';

	import Information from 'carbon-icons-svelte/lib/Information.svelte';

	$: ($room.roomData || true) && updateRoom();

	import { room } from '$lib/sessionStore';
	import { rtdb } from '$lib/firebase';
	import { ref, update } from 'firebase/database';

	let debounceTimer: any;

	const updateRoom = () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			try {
				if (!$room.roomData){
					return;
				}

				const { name, description, roomPublic, maxUsers } = $room.roomData;

				let updatePromise = [
					update(ref(rtdb, 'rooms/' + $room.roomId), {
						name,
						description,
						roomPublic,
						maxUsers
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
	<Form>
		<FormGroup disabled={!$room.isHost} legendText="Room Name">
			<TextInput light bind:value={$room.roomData.name} placeholder="Enter room name..." />
		</FormGroup>
		<FormGroup disabled={!$room.isHost}>
			<TextArea
				light
				placeholder="Enter room description..."
				maxCount={100}
				style="max-height: 150px;"
				bind:value={$room.roomData.description}
			>
				<span slot="labelText" style="display: flex; align-items: center;">
					<span>Room Description</span>
					<TooltipIcon
						disabled={!$room.isHost}
						icon={Information}
						style="margin-left: 0.5rem"
						tooltipText="Let others know what your room is about!"
						direction="right"
						align="end"
						on:click={(e) => e.preventDefault()}
					/>
				</span>
			</TextArea>
		</FormGroup>
		<FormGroup disabled={!$room.isHost} legendText="Room Size (Player Limit)">
			<Slider disabled={!$room.isHost} fullWidth light min={$room.roomData?.users ? Object.keys($room.roomData?.users).length: 1} max={8} bind:value={$room.roomData.maxUsers} />
		</FormGroup>
		<FormGroup disabled={!$room.isHost} legendText="Room Visibility">
			<Toggle bind:toggled={$room.roomData.roomPublic}>
				<span slot="labelA" style="display: flex; align-items: center;">
					Private
					<TooltipIcon
						disabled={!$room.isHost}
						icon={Information}
						style="margin-left: 0.5rem"
						tooltipText="Only users with the room code have access to your room"
						direction="right"
						align="end"
						on:click={(e) => e.preventDefault()}
					/>
				</span>
				<span slot="labelB" style="display: flex; align-items: center;">
					Public
					<TooltipIcon
						disabled={!$room.isHost}
						icon={Information}
						style="margin-left: 0.5rem"
						tooltipText="Anyone can view and join your room"
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
