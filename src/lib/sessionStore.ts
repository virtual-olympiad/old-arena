import { writable, type Writable } from 'svelte/store';

export const app: Writable<any> = writable({
    theme: 'g90',
    notification: null
});

export const pushNotification = (kind = "error", title = "", subtitle = "", caption = new Date().toLocaleString(), fullWidth = false, timeout = 0) => {
    app.update(app => {
        app.notification = {
            kind, title, subtitle, caption, fullWidth, timeout
        };
        
        return app;
    });
};

export const user: Writable<any> = writable({
    pending: true,
    user: null,
});

export const room: Writable<any> = writable({
    roomId: '',
    isHost: false,
    gameState: 'none',
    problems: []
});