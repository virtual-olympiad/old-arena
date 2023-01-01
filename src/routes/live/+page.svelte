<script lang="ts">
	import { socket } from '$lib/socket.js';
	import { auth, db, rtdb, storage } from '$lib/firebase';
	import { user, room } from '$lib/sessionStore';
	import { onValue, ref } from 'firebase/database';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
    import Game from './Game.svelte';
	import Lobby from './Lobby.svelte';

	onValue(ref(rtdb, 'rooms/' + $room?.roomId), async (snapshot) => {
		if (!snapshot.exists()) {
			if (browser) {
				goto('/');
			}

            room.set({
				...$room,
				roomData: null
			});
			return;
		}

		room.set({
			...$room,
			isHost: snapshot.val()?.host?.userId == $user.user.uid,
			roomData: snapshot.val()
		});
	});
</script>

{#if $room.gameState === 'game'}
    <Game />
{:else}
    <Lobby />
{/if}