export default function getBaseUrl() {
	const urlParts = window.location.href.split('/')
	return `${urlParts[0]}//${urlParts[2]}`
}
