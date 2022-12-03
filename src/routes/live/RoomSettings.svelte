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
		Slider
	} from 'carbon-components-svelte';

	import Information from 'carbon-icons-svelte/lib/Information.svelte';
	import AddFilled from 'carbon-icons-svelte/lib/AddFilled.svelte';

	let name = '',
		description = '',
		roomPublic = true,
		maxUsers = 8;

	$: (name || true) && updateRoom();
	$: (description || true) && updateRoom();
	$: (roomPublic || true) && updateRoom();
	$: (maxUsers || true) && updateRoom();

	let debounceTimer: any;

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

		({ name, description, roomPublic } = snapshot.val());
	});

	const updateRoom = () => {
		console.log('cleared');
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			console.log('updated');
			try {
				let updatePromise = [
					update(ref(rtdb, 'rooms/' + $room.roomId), {
						name,
						description,
						roomPublic,
						maxUsers
					})
				];

				if (roomPublic) {
					updatePromise.push(set(ref(rtdb, 'publicRooms/' + $room.roomId), true));
				} else {
					updatePromise.push(remove(ref(rtdb, 'publicRooms/' + $room.roomId)));
				}

				await Promise.allSettled(updatePromise);
			} catch (error) {
				console.error(error);
			}
		}, 1000);
	};
</script>

<section class="room-panel">
	<Form>
		<FormGroup legendText="Room Name">
			<TextInput light bind:value={name} placeholder="Enter room name..." />
		</FormGroup>
		<FormGroup>
			<TextArea
				light
				placeholder="Enter room description..."
				maxCount={100}
				style="max-height: 150px;"
				bind:value={description}
			>
				<span slot="labelText" style="display: flex; align-items: center;">
					<span>Room Description</span>
					<TooltipIcon
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
		<FormGroup legendText="Room Size (Player Limit)">
			<Slider fullWidth light min={$room.roomInfo?.users ? Object.keys($room.roomInfo?.users).length: 1} max={8} bind:value={maxUsers} />
		</FormGroup>
		<FormGroup legendText="Room Visibility">
			<Toggle bind:toggled={roomPublic}>
				<span slot="labelA" style="display: flex; align-items: center;">
					Private
					<TooltipIcon
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
