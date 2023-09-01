type Annotation = {
	filename: string
	annotations: string[]
}

export async function parseLabels(files: FileList): Promise<Set<string> | undefined> {
	const txtFile = Array.from(files).find(file => file.name.endsWith('.txt'))
	return await txtFile
		?.text()
		.then(text => text.split('\n').filter(line => line.trim().length > 0))
		.then(lines => new Set(lines))
		.catch(() => undefined)
}

export function saveAnnotation(annotation: Annotation) {
	localStorage.setItem(annotation.filename, JSON.stringify(annotation))
}

export function getAnnotation(filename: string): string[] | undefined {
	const annotation = localStorage.getItem(filename)
	if (!annotation) return undefined

	const parsed = JSON.parse(annotation)
	return Object.hasOwn(parsed, 'annotations') ? parsed.annotations : undefined
}

function getAnnotations(): Annotation[] {
	const annotations: Annotation[] = []
	for (let i = 0; i < localStorage.length; i++) {
		try {
			const annotation = localStorage.getItem(localStorage.key(i)!)
			const parsedAnnotation = JSON.parse(annotation!)
			if (parsedAnnotation.annotations.length === 0) continue

			annotations.push(parsedAnnotation)
		} catch (e) {
			continue
		}
	}
	return annotations
}

export function downloadAnnotations() {
	const annotations = getAnnotations()
	const blob = new Blob([JSON.stringify(annotations)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `annotations-${new Date().toLocaleString()}.json`
	a.click()
	URL.revokeObjectURL(url)
}
