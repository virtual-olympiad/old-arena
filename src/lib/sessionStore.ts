import { writable, type Writable } from 'svelte/store';

export const user: Writable<any> = writable({
    pending: true,
    user: null
});


