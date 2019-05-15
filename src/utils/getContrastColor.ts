import bestContrast from 'get-best-contrast-color'

const blackAndWhite = ['#000', '#FFF']

export default function getContrastColor(original: string, colors: string[] = blackAndWhite) {
	return bestContrast(`#${original}`, colors)
}
