import memoize from 'lodash-es/memoize'

export function rawPrettyDate(date: string | Date, options?: object) {
	if (typeof date === 'string') {
		date = new Date(Date.parse(date))
	}

	let userLang = navigator.language

	return new Intl.DateTimeFormat(userLang, options).format(date)
}

export default memoize(rawPrettyDate)
