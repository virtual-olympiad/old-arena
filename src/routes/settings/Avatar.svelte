<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { user } from '$lib/sessionStore';
	import { FileUploader, ImageLoader, InlineNotification } from 'carbon-components-svelte';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { storage } from '$lib/firebase';

	let uploading = false;
	let updated = false;
	let src: string = '';
	let toast = '';
	let pfp: any[];

	const downloadImage = async (node: any) => {
		src = await getDownloadURL(ref(storage, `pfp/${$user.user.uid}/pfp`));
	};

	const uploadAvatar = async () => {
		try {
			toast = '';
			uploading = true;
			if (!pfp || pfp.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = pfp[0];
			if (file.size > 50000) {
				throw new Error('Your profile picture exceeds the maximum 50KB size.');
			}

			// const fileExt = file.name.split('.').pop();
			const filePath = `${$user.user?.uid}`;

			await uploadBytes(ref(storage, `pfp/${$user.user.uid}/pfp`), file);

			updated = !updated;
			toast = 'success';
			// dispatch('upload');
		} catch (error) {
			toast = error.message as string;
			console.error(error);
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
			kind={toast == 'success' ? 'success' : 'error'}
			title={toast == 'success' ? 'Upload Success' : 'Upload Error'}
			subtitle={toast == 'success' ? "":toast}
			timeout={10000}
			style="flex-shrink: 0; align-items: center;"
		/>
	{/if}
{/key}

<div class="settings-avatar">
	<FileUploader
		status={uploading ? 'uploading' : 'complete'}
		labelTitle="Profile Picture"
		buttonLabel="Upload file"
		labelDescription="Only PNG and JPG/JPEG files are accepted."
		iconDescription="Uploaded!"
		class="no-select" 
		disabled={uploading}
		bind:files={pfp}
		on:change={()=> setTimeout(uploadAvatar, 100)}
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
