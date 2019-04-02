import memoize from 'lodash-es/memoize'
import moment from 'moment'

export function rawPrettyDate(str: string) {
	return moment(str).format('D. M. YYYY')
}

export default memoize(rawPrettyDate)
