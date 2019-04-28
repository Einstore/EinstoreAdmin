export default function usure(message: string = 'Are you sure?') {
	return new Promise((res, rej) => {
		if (window.confirm(message)) {
			res()
		} else {
			rej()
		}
	})
}
