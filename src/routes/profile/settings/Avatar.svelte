<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { user } from "$lib/sessionStore";
	import { FileUploader, ImageLoader, InlineNotification } from 'carbon-components-svelte';

	let uploading = false;
	let updated = false;
	let src: string = '';
	let toast = '';
	let pfp: any[];

	const dispatch = createEventDispatcher();

	const downloadImage = (node: any) => {
		supabase.storage
			.from('avatars')
			.download(`${$user?.id}.png`)
			.then(({ data, error }) => {
				if (error) throw error;
				src = URL.createObjectURL(data as Blob);
			})
			.catch((error) => console.error('Error downloading image: ', error.message));
	};

	const uploadAvatar = async () => {
		try {
			toast = '';
			uploading = true;
			if (!pfp || pfp.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = pfp[0];
			if (file.size > 20000) {
				throw new Error('Your profile picture exceeds the maximum 20KB size.');
			}

			// const fileExt = file.name.split('.').pop();
			const filePath = `${$user?.id}.png`;

			let { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, file, { cacheControl: '60', upsert: true });

			if (uploadError) throw uploadError;

			updated = !updated;
			toast = 'success';
			dispatch('upload');
		} catch ({ message }) {
			toast = message as string;
			console.error(message);
			pfp.pop();
		} finally {
			uploading = false;
			pfp.splice(0, pfp.length - 1);
		}
	};

	onMount(() => {
		downloadImage(null);
	});
</script>

{#key toast}
	{#if toast}
		<InlineNotification
			lowContrast
			kind={toast == "success" ? "success":"error"}
			title={toast == "success" ? "Successfully Updated Avatar" : "Error Uploading: "}
			subtitle={toast == "success" ? "Allow up to a minute for changes to take place." : toast}
			timeout={5000}
		/>
	{/if}
{/key}

<div class="settings-avatar">
	<FileUploader
		status={uploading ? 'uploading' : 'complete'}
		labelTitle="Profile Picture"
		buttonLabel="Upload file"
		labelDescription="Only PNG files are accepted."
		iconDescription="Uploaded!"
		accept={['.png']}
		disabled={uploading}
		bind:files={pfp}
		on:change={() => setTimeout(uploadAvatar, 100)}
	/>

	{#key updated}
		{#if src}
			<img use:downloadImage {src} alt="Avatar" class="avatar" />
		{/if}
	{/key}
</div>

<style lang="scss">
	.settings-avatar {
		display: flex;
		align-items: center;

		.avatar {
			object-fit: contain;
			max-height: 6em;
		}
	}
</style>
