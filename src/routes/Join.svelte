<script lang="ts">
	import type { RoomAbstract } from 'src/app';

	import { socket } from '../lib/socket.js';
	import { onMount } from 'svelte';

	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		ToolbarMenu,
		ToolbarMenuItem,
		Button,
		Pagination,
		TextInput
	} from 'carbon-components-svelte';

	import Renew from 'carbon-icons-svelte/lib/Renew.svelte';
	import CaretRight from "carbon-icons-svelte/lib/CaretRight.svelte";

	let roomHeaders = [
		{ key: 'name', value: 'Room Name' },
		{ key: 'description', value: 'Description', sort: false },
		{ key: 'mode', value: 'Mode' },
		{ key: 'players', value: 'Players' },
		{ key: 'teamsEnabled', value: 'Teams' },
		{ key: 'join', empty: true }
	];

	let rooms: RoomAbstract[] = [
		{
			id: 0,
			name: "Mango's room",
			description: 'Join for fun AIME practice!',
			mode: 'Relay',
			playerCount: 6,
			playerLimit: 8,
			teamsEnabled: true
		},
		{
			id: 1,
			name: 'Pineappo!!',
			description: 'With a side of jelly',
			mode: 'Showdown',
			playerCount: 3,
			playerLimit: 8,
			teamsEnabled: false
		},
		{
			id: 2,
			name: 'AMC training',
			description: 'AMC10 Q10-Q20 range practice, host rotate',
			mode: 'Standard',
			playerCount: 7,
			playerLimit: 8,
			teamsEnabled: false
		},
		{
			id: 3,
			name: 'Mcdonalds Floor Moppers',
			description: 'USA(J)MO easy prayge',
			mode: 'Standard',
			playerCount: 8,
			playerLimit: 8,
			teamsEnabled: false
		}
	];

	let pageSize = 5;
	let page = 1;

	onMount(() => {
		socket.on('update-rooms', (newRooms) => {
			rooms = newRooms;
		});
	});

	let roomCode: string = '';

	const joinRoom = () => {
		socket.emit('join-room', {
			username: username,
			roomCode: roomCode
		});
	};

	export let username: string;
</script>

<section class="join-room-panel">
	<article class="roomcode-wrapper">
		<TextInput maxlength={4} labelText="Join with Code" placeholder="Enter room code..." />
	</article>

	<section class="room-listing">
		<div style={"border: 1px solid #ffffff;"}>
			<DataTable
				sortable
				zebra
				title="Public Rooms"
				description={rooms.length + ' public rooms open'}
				headers={roomHeaders}
				rows={rooms.map((room) => {
					let newRoom = room;
					newRoom.players = room.playerCount + '/' + room.playerLimit;
					newRoom.teamsEnabled = room.teamsEnabled ? 'Enabled' : 'Disabled';
					return newRoom;
				})}
				style="overflow: auto hidden;"
			>
				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch persistent shouldFilterRows />
						<Button kind="ghost" tooltipPosition="top" tooltipAlignment="end" iconDescription="Refresh" icon={Renew} />
					</ToolbarContent>
				</Toolbar>
				<svelte:fragment slot="cell" let:cell>
					{#if cell.key === 'join'}
						<Button
							style="float: right;"
							kind="ghost"
							iconDescription="Join"
							icon={CaretRight}
							href="#"
						/>
					{:else}{cell.value}{/if}
				</svelte:fragment>
			</DataTable>
			<Pagination bind:pageSize bind:page totalItems={rooms.length} pageSizeInputDisabled />
		</div>
	</section>
</section>

<style lang="scss">
	.join-room-panel {
		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 1rem;

		width: 100%;
		height: 100%;

		text-align: left;

		.roomcode-wrapper {
			margin-bottom: 2rem;
		}

		.room-listing {
			width: 100%;
			max-width: 1056px;

			padding-bottom: 1rem;
		}
	}
</style>
