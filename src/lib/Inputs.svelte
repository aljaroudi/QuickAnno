<script lang="ts">
	import { downloadAnnotations } from '$lib'

	export let labels: Set<string>
	export let currentLabels: Set<string>
	export let onClick: (label: string) => void
	export let totalImages: number
	export let currentCount: number
</script>

<div class="flex flex-col gap-2 px-2 w-52">
	{#each labels as label, i}
		<button
			class="flex items-center w-full h-8 gap-2 px-2 py-1 text-white transition bg-teal-600 rounded-lg aria-pressed:bg-teal-300 aria-pressed:text-black hover:bg-teal-500"
			on:click={() => onClick(label)}
			aria-pressed={currentLabels.has(label)}
		>
			{#if i < 9}
				<span
					class="w-5 h-5 text-black bg-gray-200 border border-b-2 border-r-2 border-gray-400 rounded-md"
				>
					{i + 1}
				</span>
			{/if}
			{label}
		</button>
	{/each}
	<button
		class="flex items-center w-full h-8 gap-2 px-2 py-1 text-white transition bg-teal-600 rounded-lg shadow aria-pressed:bg-rose-300 aria-pressed:text-black hover:bg-teal-500"
		on:click={() => onClick('none')}
		aria-pressed={currentLabels.has('none')}
	>
		<span
			class="w-5 h-5 text-black bg-gray-200 border border-b-2 border-r-2 border-gray-400 rounded-md"
		>
			0
		</span>
		none
	</button>

	<div class="flex flex-col gap-2 mt-auto">
		<button
			on:click={() => downloadAnnotations()}
			class="p-2 text-white transition rounded-lg bg-sky-600 hover:bg-sky-500"
		>
			Export
		</button>
		<p>{currentCount} / {totalImages}</p>
		<p>[arrows] → navigate</p>
		<p>[enter] → submit</p>
		<p>[esc] → clear files</p>
	</div>
</div>
