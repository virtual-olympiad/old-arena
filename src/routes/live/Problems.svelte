<script lang="ts">
	import { browser } from '$app/environment';
	import { app } from '$lib/sessionStore';
	import {
		Button,
		InlineLoading,
		NumberInput,
		RadioButton,
		RadioButtonGroup,
		truncate
	} from 'carbon-components-svelte';

	import SortAscending from 'carbon-icons-svelte/lib/SortAscending.svelte';
	import SortDescending from 'carbon-icons-svelte/lib/SortDescending.svelte';
	import SortRemove from 'carbon-icons-svelte/lib/SortRemove.svelte';
	import { afterUpdate } from 'svelte';

	export let problems: any, savingAnswers: boolean, savedAnswers: any, problemAnswers: any;

    let sortAscending = true;

    const updateKatexTheme = () => {
		if (browser) {
			if ($app.theme == 'g90') {
				document.querySelectorAll('.latex, .latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', 'filter: invert(1) hue-rotate(180deg);');
				});
			} else {
				document.querySelectorAll('.latex, .latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', '');
				});
			}
		}
	};

	afterUpdate(updateKatexTheme);

	const saveStatus = (i: number) => {
		if ((problemAnswers[i] ?? '') == (savedAnswers[i] ?? '')) {
			return 'finished';
		}

		if (savingAnswers) {
			return 'active';
		}

		return 'error';
	};

	const saveDescription = (i: number) => {
		switch (saveStatus(i)) {
			case 'finished':
				return 'Saved';
			case 'active':
				return 'Saving';
			case 'error':
				return 'Unsaved';
		}
	};
</script>

{#key sortAscending}
	{#each problems as { problem, answerType, index }, i}
		<div class="problem no-select" id={'problem-' + i}>
			<div style="display: flex; align-items: center;">
				<h4 class="problem-title" use:truncate>
					Problem {index + 1}
				</h4>
				{#key savingAnswers ? problemAnswers[index] : null}
					{#key savedAnswers[index]}
						<InlineLoading
							status={saveStatus(index)}
							description={saveDescription(index)}
							style="padding: 0 1rem; width: fit-content"
						/>
					{/key}
				{/key}
				{#if i == 0}
					<Button
						icon={sortAscending ? SortAscending : SortDescending}
						kind="ghost"
						size="field"
						on:click={() => {
							sortAscending = !sortAscending;
							problems.reverse();
						}}
						style="margin-left: auto;"
					>
						{sortAscending ? 'Sort: Difficulty Ascending' : 'Sort: Difficulty Descending'}
					</Button>
				{/if}
			</div>
			<div class="problem-container">
				{@html problem}
			</div>
			<div class="answer-container">
				{#if answerType == 'amc'}
					<RadioButtonGroup legendText="Multiple Choice" bind:selected={problemAnswers[index]}>
						<RadioButton value="">
							<span slot="labelText" style="font-size: 16px; font-weight: 400;"> - </span>
						</RadioButton>
						{#each ['a', 'b', 'c', 'd', 'e'] as choice, j}
							<RadioButton value={choice}>
								<span slot="labelText" style="font-size: 16px; font-weight: 400;">
									{choice.toUpperCase()}
								</span>
							</RadioButton>
						{/each}
					</RadioButtonGroup>
				{:else if answerType == 'aime'}
					<NumberInput
						allowEmpty
						hideSteppers
						light
						size="sm"
						label="Integer Answer"
						min={0}
						max={999}
						bind:value={problemAnswers[index]}
					/>
				{/if}
			</div>
		</div>
	{/each}
{/key}

<style lang="scss">
	.problem {
		width: 100%;
		padding: 1rem 0.5rem;
		display: flex;
		flex-direction: column;
		border-bottom: 1px dotted #999;

		.problem-title {
			font-weight: 500;
		}

		.problem-container {
			height: 100%;
			overflow-x: auto;
			padding: 1rem 0;
			margin: 0 0 0.5rem 0;
		}

		.answer-container {
			overflow-x: auto;
		}
	}
</style>
