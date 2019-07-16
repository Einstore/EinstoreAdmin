import * as browserStorage from './browserStorage'

export default function pageTitle(pageName?: string): void {
	const serverName = browserStorage.get('serverName')
	let title = pageName ? pageName + ' | ' : ''

	if(serverName.length > 0){
		title += serverName
	}

	document.title = title
}
