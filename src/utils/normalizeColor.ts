export default function normalizeColor(original: string, fallback = '#000') {
	return original ? `#${original.replace(/#/g, '')}` : fallback
}
