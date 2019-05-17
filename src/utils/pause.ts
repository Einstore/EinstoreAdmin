export default function pause<T>(miliseconds: number = 500, scatter: number = 2000) {
	return (result: T) =>
		new Promise<T>((resolve) =>
			setTimeout(() => resolve(result), miliseconds + Math.random() * scatter)
		)
}
