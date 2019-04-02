export default function previewFileImage(file: File) {
	return new Promise<string>((resolve) => {
		const reader = new FileReader()

		reader.onload = function(e: ProgressEvent) {
			resolve('' + reader.result)
		}

		reader.readAsDataURL(file)
	})
}
