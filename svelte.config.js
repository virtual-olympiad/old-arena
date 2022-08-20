import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { optimizeImports, optimizeCss } from "carbon-preprocess-svelte";
import * as dotenv from 'dotenv';
dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;'
			}
		})
	],

	kit: {
		adapter: adapter(),

		vite: {
			ssr: {
				noExternal: [/^@smui(?:-extra)?\//],
			},
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: '@use "src/variables.scss" as *;'
					}
				}
			},
			plugins: [process.env.NODE_ENV === "production" && optimizeCss()]
		}
	}
};

export default config;
