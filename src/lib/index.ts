type Annotation = {
	filename: string
	annotations: Set<string>
}

export async function parseLabels(files: FileList): Promise<Set<string> | undefined> {
	const txtFile = Array.from(files).find(file => file.name.endsWith('.txt'))
	return await txtFile
		?.text()
		.then(text => text.split('\n').filter(line => line.trim().length > 0))
		.then(lines => new Set(lines))
		.catch(() => undefined)
}

export function saveAnnotation({ filename, annotations }: Annotation) {
	localStorage.setItem(
		filename,
		JSON.stringify({
			filename,
			annotations: annotations.has('none') ? [] : Array.from(annotations),
		})
	)
}

export function getAnnotation(filename: string): Set<string> | undefined {
	const annotation = localStorage.getItem(filename)
	if (!annotation) return undefined

	const parsed = JSON.parse(annotation)
	if (!Object.hasOwn(parsed, 'annotations') || !Array.isArray(parsed.annotations)) return undefined
	return parsed.annotations.length === 0 ? new Set(['none']) : new Set(parsed.annotations)
}

function getAnnotations(images: FileList): Annotation[] {
	const annotations: Annotation[] = []
	for (const { name: filename } of images) {
		const data = localStorage.getItem(filename)
		if (!data) continue
		const json = JSON.parse(data)
		if (
			Object.hasOwn(json, 'filename') &&
			Object.hasOwn(json, 'annotations') &&
			Array.isArray(json.annotations)
		)
			annotations.push(json)
	}
	return annotations
}

export function downloadAnnotations(images: FileList) {
	const annotations = getAnnotations(images)
	const blob = new Blob([JSON.stringify(annotations)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `annotations-${new Date().toLocaleString()}.json`
	a.click()
	URL.revokeObjectURL(url)
}
