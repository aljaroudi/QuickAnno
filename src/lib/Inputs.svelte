<script lang="ts">
	export let labels: Set<string>
	export let currentLabels: string[]
	export let onClick: (label: string) => void
	export let downloadURL: string | undefined
</script>

<div class="flex flex-col gap-2 px-2 w-52">
	{#each labels as label, i}
		<button
			class="sticky bottom-0 flex items-center w-full h-8 gap-2 px-2 py-1 text-white transition bg-teal-600 rounded-lg aria-pressed:bg-teal-300 aria-pressed:text-black hover:bg-teal-500"
			on:click={() => onClick(label)}
			aria-pressed={currentLabels.includes(label)}
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

	<div class="flex flex-col gap-2 mt-auto">
		{#if downloadURL?.length}
			<a
				href={downloadURL}
				on:click={() => (downloadURL = undefined)}
				download
				class="p-2 text-white transition rounded-lg bg-sky-600 hover:bg-sky-500"
			>
				Download
			</a>
		{/if}
		<p>[arrows] → navigate</p>
		<p>[enter] → submit</p>
		<p>[esc] → clear files</p>
	</div>
</div>
