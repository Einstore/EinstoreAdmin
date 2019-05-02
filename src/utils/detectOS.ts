export enum OSName {
	UNKNOWN = 'unknown',
	WINDOWS = 'windows',
	MACOS = 'macos',
	UNIX = 'unix',
	LINUX = 'linux',
	IOS = 'ios',
	ANDROID = 'android',
}

export default function detectOS(): OSName {
	const platform = navigator.platform

	if (platform.indexOf('Win') !== -1) {
		return OSName.WINDOWS
	}

	if (platform.indexOf('Mac') !== -1) {
		return OSName.MACOS
	}

	if (platform.indexOf('X11') !== -1) {
		return OSName.UNIX
	}

	if (platform.indexOf('Linux') !== -1) {
		return OSName.LINUX
	}

	if (platform.indexOf('iPhone') !== -1) {
		return OSName.IOS
	}

	if (platform.indexOf('Android') !== -1) {
		return OSName.ANDROID
	}

	return OSName.UNKNOWN
}
