import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	},
	optimizeDeps: {
		exclude: [
			'firebase',
			'firebase/app',
			'firebase/auth',
			'firebase/firestore',
			'firebase/analytics',
			'firebase/database',
			'firebase/storage'
		]
	}
};

export default config;
