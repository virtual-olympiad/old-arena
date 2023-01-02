<script lang="ts">
	import { browser } from '$app/environment';
	import { app } from '$lib/sessionStore';
	import {
		Button,
		CopyButton,
		InlineLoading,
		NumberInput,
		OutboundLink,
		OverflowMenu,
		OverflowMenuItem,
		RadioButton,
		RadioButtonGroup,
		Tag,
		truncate
	} from 'carbon-components-svelte';
	import { afterUpdate } from 'svelte';

	import SkillLevel from 'carbon-icons-svelte/lib/SkillLevel.svelte';
	import SkillLevelBasic from 'carbon-icons-svelte/lib/SkillLevelBasic.svelte';
	import SkillLevelIntermediate from 'carbon-icons-svelte/lib/SkillLevelIntermediate.svelte';
	import SkillLevelAdvanced from 'carbon-icons-svelte/lib/SkillLevelAdvanced.svelte';
	import WarningFilled from 'carbon-icons-svelte/lib/WarningFilled.svelte';
	import Launch from 'carbon-icons-svelte/lib/Launch.svelte';

	import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';

	const updateKatexTheme = () => {
		if (browser) {
			if ($app.theme == 'g90') {
				document.querySelectorAll('.latex, .latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', 'filter: invert(1) hue-rotate(180deg)');
				});
			} else {
				document.querySelectorAll('.latex, .latexcenter').forEach((img) => {
					(img as HTMLElement).setAttribute('style', '');
				});
			}
		}
	};

	afterUpdate(updateKatexTheme);

	const difficultyLevel = (difficulty: number) => {
		if (difficulty <= 2) {
			return {
				type: 'green',
				icon: SkillLevel
			};
		}

		if (difficulty <= 3.5) {
			return {
				type: 'purple',
				icon: SkillLevelBasic
			};
		}

		if (difficulty <= 5) {
			return {
				type: 'magenta',
				icon: SkillLevelIntermediate
			};
		}

		return {
			type: 'red',
			icon: SkillLevelAdvanced
		};
	};

	const isCorrect = (response: string | number, solution: any) => {
		return (Array.isArray(solution) && solution.includes(response)) ||
			solution === response;
	};

	export let solutions: any, savedAnswers: any;
</script>

{#each solutions as { answer, difficulty, problemTitle, link, problem, answerType }, i}
	<div class="problem" id={'problem-' + i}>
		<div
			style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end;"
		>
			<h4
				class="problem-title"
				style="display: flex; align-items: center; white-space: nowrap; overflow-x: auto; margin-right: auto;"
			>
				Problem {i + 1}: {problemTitle}
				<Tag
					interactive
					type={difficultyLevel(difficulty).type}
					icon={difficultyLevel(difficulty).icon}
					style="margin-left: 1rem; flex-shrink: 0;"
				>
					{difficulty.toFixed(2)}
				</Tag>
			</h4>
			{#if savedAnswers[i] || savedAnswers[i] === 0}
				<InlineLoading
					style="width:fit-content; margin: 0 .5rem;"
					status={isCorrect(savedAnswers[i], answer) ? 'finished' : 'error'}
					description={isCorrect(savedAnswers[i], answer) ? 'Correct' : 'Incorrect'}
				/>
			{/if}
			<OverflowMenu flipped>
				<OverflowMenuItem>
					<Launch style="margin-right: .25rem;" /> View on AoPS
				</OverflowMenuItem>
				<OverflowMenuItem>
					<svelte:component this={difficultyLevel(difficulty).icon} style="margin-right: .25rem;" />
					{'Difficulty: ' + difficulty.toFixed(2)}
				</OverflowMenuItem>
				<OverflowMenuItem hasDivider danger>
					<WarningFilled style="margin-right: .25rem;" /> Report Problem
				</OverflowMenuItem>
			</OverflowMenu>
		</div>
		<div class="problem-container">
			{@html problem}
		</div>
		<div class="answer-container">
			{#if answerType == 'amc'}
				<RadioButtonGroup legendText="Multiple Choice" bind:selected={savedAnswers[i]} disabled>
					<RadioButton value="">
						<span slot="labelText" style="font-size: 16px; font-weight: 400;"> - </span>
					</RadioButton>
					{#each ['a', 'b', 'c', 'd', 'e'] as choice, j}
						<RadioButton value={choice}>
							<span
								slot="labelText"
								style="font-size: 16px; font-weight: 400; display: flex; align-items: center;"
							>
								{choice.toUpperCase()}
								{#if answer.includes(choice)}
									<CheckmarkFilled style="margin-left: .25rem;" />
								{/if}
							</span>
						</RadioButton>
					{/each}
				</RadioButtonGroup>
			{:else if answerType == 'aime'}
				<NumberInput
					disabled
					allowEmpty
					hideSteppers
					light
					size="sm"
					label="Integer Answer"
					min={0}
					max={999}
					bind:value={savedAnswers[i]}
					helperText={'Answer: ' + (Array.isArray(answer) ? answer.join(', '): answer)}
				/>
			{/if}
		</div>
	</div>
{/each}

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
