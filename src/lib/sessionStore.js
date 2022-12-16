import { writable } from 'svelte/store';
export const app = writable({
    theme: 'g90'
});
export const user = writable({
    pending: true,
    user: null,
});
export const room = writable({
    roomId: '',
    isHost: false,
    gameState: 'none',
    problems: []
});
//# sourceMappingURL=sessionStore.js.map