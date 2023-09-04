<script lang="ts">
	import { getAnnotation, parseLabels, saveAnnotation } from '$lib'
	import Inputs from '$lib/Inputs.svelte'

	let images: FileList | undefined

	let labels = new Set<string>()
	let current = {
		index: -1,
		filename: '',
		annotations: new Set<string>(),
	}

	function nextImage(offset: 1 | -1 = 1) {
		current.filename.length &&
			saveAnnotation({
				filename: current.filename,
				annotations: current.annotations,
			})
		if (!images?.length) return

		let index = current.index + offset
		if (index < 0) index = images.length - 1
		if (index >= images.length) index = 0

		current = {
			index,
			filename: images[index].name,
			annotations: getAnnotation(images[index].name) ?? new Set<string>(),
		}
	}

	function toggleLabel(label: string) {
		const prev = current.annotations
		if (label === 'none' && prev.delete('none')) {
			current.annotations = prev
		} else if (label === 'none') {
			current.annotations = new Set(['none'])
		} else {
			prev.delete('none')
			prev.delete(label) || prev.add(label)
			current.annotations = prev
		}
	}

	window.addEventListener('keydown', e => {
		if (!images) return

		switch (e.key) {
			case 'Escape':
				images = undefined
				labels = new Set<string>()
				break

			case 'ArrowRight':
			case 'ArrowDown':
			case 'Enter':
			case ' ':
				nextImage(1)
				break

			case 'ArrowLeft':
			case 'ArrowUp':
				nextImage(-1)
				break

			default:
				if (!e.key.match(/[0-9]/)) break
				if (e.key === '0') toggleLabel('none')
				const label = [...labels][Number(e.key) - 1]
				if (label) toggleLabel(label)
		}
	})

	$: images?.length && nextImage()
</script>

{#if !labels?.size}
	<label for="labels" class="my-auto text-base">
		<strong> Select a .txt file with the class names to be used for labeling. </strong>
		<input
			type="file"
			id="labels"
			name="labels"
			accept=".txt"
			on:change={e => {
				const files = e.currentTarget.files
				if (files) void parseLabels(files).then(data => data && (labels = data))
			}}
		/>
	</label>
{:else if !images?.length}
	<label for="images" class="my-auto text-base">
		<strong> Select your images</strong>
		<input type="file" id="images" name="images" accept="image/*" multiple bind:files={images} />
	</label>
{:else if current.index >= 0 && current.index < images.length}
	<div class="flex justify-between w-full h-full">
		<Inputs
			{labels}
			onClick={label => toggleLabel(label)}
			currentLabels={current.annotations}
			totalImages={images.length}
			currentCount={current.index + 1}
		/>
		<div class="flex w-full">
			<img
				src={URL.createObjectURL(images[current.index])}
				alt="current task"
				class="h-full mx-auto rounded-md"
			/>
		</div>
	</div>
{/if}
