<script lang="ts">
	import type { RoomAbstract } from 'src/app';
	import { socket } from '$lib/socket';
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
		TextInput,
		Loading
	} from 'carbon-components-svelte';

	import Renew from 'carbon-icons-svelte/lib/Renew.svelte';
	import CaretRight from 'carbon-icons-svelte/lib/CaretRight.svelte';

	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

	import { onValue, ref } from 'firebase/database';
	import { rtdb } from './firebase';
	import { user } from '$lib/sessionStore';

	let roomHeaders: DataTableHeader[] = [
		{ key: 'name', value: 'Room Name' },
		{ key: 'description', value: 'Description', sort: false },
		{ key: 'mode', value: 'Mode' },
		{ key: 'players', value: 'Players' },
		{ key: 'teamsEnabled', value: 'Teams' },
		{ key: 'join', empty: true }
	];

	let loadingPublicRooms = false;

	let rooms: RoomAbstract[] = [];

	const parseMode = (mode: string) => {
		switch(mode){
			case 'standard':
				return 'Standard';
			case 'relay':
				return 'Relay';
			case 'showdown':
				return 'Showdown';
			default:
				return 'Standard';
		}
	};

	onValue(ref(rtdb, 'rooms'), snapshot => {
		const snap = snapshot.val();
		rooms = Object.keys(snap).map(i => {
			const room = snap[i];

			return {
				...room,
				join: i,
				mode: parseMode(room.mode),
				players: room.users.length + '/' + room.maxUsers,
				teamsEnabled: room.teamsEnabled ? 'Enabled':'Disabled'
			}
		});

		console.log(rooms);
	});

	let pageSize = 5;
	let page = 1;

	let roomCode: string = '';

	let loadingJoin = false;

	const joinRoom = async (code = roomCode) => {
		loadingJoin = true;
		try {
			const idToken = await $user.user.getIdToken(true);
			socket.emit('join-room', {
				idToken,
				data: {
					code
				}
			});
		} catch(error){
			console.error(error);
		}
		loadingJoin = false;
	};
</script>

<section class="join-room-panel">
	<article class="roomcode-wrapper">
		<TextInput bind:value={roomCode} maxlength={4} labelText="Join with Code" placeholder="Enter room code..." />
	</article>

	<section class="room-listing">
		<div style={'border: 1px solid #ffffff;'}>
			<DataTable
				sortable
				zebra
				title="Public Rooms"
				description={rooms.length + ' public rooms open'}
				headers={roomHeaders}
				rows={rooms}
				style="overflow: auto hidden;"
			>
				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch persistent shouldFilterRows />
					</ToolbarContent>
				</Toolbar>
				<svelte:fragment slot="cell" let:cell>
					{#if loadingPublicRooms}
						{#if cell.key === 'name'}
							<Loading withOverlay={false} small />
						{/if}
					{:else if cell.key === 'join'}
						<Button
							disabled={loadingJoin}
							on:click={()=> joinRoom(cell.value)}
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
