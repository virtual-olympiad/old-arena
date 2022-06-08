/// <reference types="@sveltejs/kit" />

import 'svelte';

interface RoomAbstract {
	name: string;
	mode: roomMode;
	playerCount: number;
	playerLimit: number;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}
