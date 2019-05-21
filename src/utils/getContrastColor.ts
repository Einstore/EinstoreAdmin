import bestContrast from 'get-best-contrast-color'
import normalizeColor from './normalizeColor'

const blackAndWhite = ['#000', '#FFF']

export default function getContrastColor(original: string, colors: string[] = blackAndWhite) {
	return bestContrast(normalizeColor(original), colors)
}
