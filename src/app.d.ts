/// <reference types="@sveltejs/kit" />

import 'svelte';

type RoomMode = 'standard' | 'relay' | 'showdown';

interface RoomAbstract {
	id: number;
	name: string;
	description: string;
	mode: RoomMode;
	settings: any;
	players: any;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}
