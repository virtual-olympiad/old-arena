<script lang="ts">
	import '../app.scss';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

	import 'carbon-components-svelte/css/all.css';
	import { Theme, Content, ToastNotification, Loading } from 'carbon-components-svelte';

	import Navbar from './Navbar.svelte';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { app, room, user } from '$lib/sessionStore';
	import { onMount } from 'svelte';
	import { socket } from '$lib/socket';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let authConnected = false;

	onAuthStateChanged(auth, (currentUser) => {
		user.set({
			...$user,
			user: currentUser
		});
	});

	app.subscribe((app) => {
		if (browser){
			if (app.theme == 'g90') {
				document.querySelectorAll('.latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', 'filter: invert(1);');
				});
			} else {
				document.querySelectorAll('.latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', '');
				});
			}
		}
	});

	user.subscribe((user) => {
		if (!user.pending) {
			authConnected = true;
		}
	});

	socket.on('exit-room-success', () => {
		room.set({
			...$room,
			roomId: '',
			gameState: 'none'
		});

		goto('/live');
	});

	socket.on('create-room-success', ({ roomId }) => {
		room.set({
			...$room,
			roomId,
			gameState: 'lobby'
		});

		goto('/live');
	});

	socket.on('join-room-success', ({ roomId }) => {
		room.set({
			...$room,
			roomId,
			gameState: 'lobby'
		});

		goto('/live');
	});

	socket.on('started-game', () => {
		room.set({
			...$room,
			gameState: 'game'
		});
	});
</script>

<svelte:head>
	<!-- Roboto -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
	/>
	<!-- Roboto Mono -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
	<!-- Katex -->
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"
		integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0"
		crossorigin="anonymous"
	/>
</svelte:head>

<Theme bind:theme={$app.theme} persist persistKey="__carbon-theme" />

<div class="svelte">
	<Navbar />
	{#if authConnected}
		<section class="main-content">
			<slot />
		</section>
	{:else}
		<Loading />
	{/if}
</div>

<style lang="scss">
	.svelte {
		width: 100vw;
		height: 100vh;

		position: relative;
	}

	.main-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 48px;
		padding: 1rem;

		overflow: auto;
	}
</style>
