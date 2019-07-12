const storage = window.localStorage

export function get(key: string, defaultValue?: string): string {
	let value = storage.getItem(key)
	if(typeof value === 'string'){
		return value
	}
	if(defaultValue){
		return defaultValue
	}
	return ''
}

export function set(key: string, value: string) {
	storage.setItem(key, value)
}
