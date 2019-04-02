export function splitToIdentifiersAndRegularTags(tags: string[]) {
	const identifiers: string[] = []
	const regularTags: string[] = []

	for (let tag of tags) {
		if (tag.substr(0, 2) === '@@') {
			identifiers.push(tag.substr(2))
		} else {
			regularTags.push(tag)
		}
	}

	return { identifiers, regularTags }
}
