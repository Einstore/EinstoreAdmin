export default function usure(message: string = 'Are you sure?') {
	return new Promise((res, rej) => {
		if (confirm(message)) {
			res()
		} else {
			rej()
		}
	})
}
