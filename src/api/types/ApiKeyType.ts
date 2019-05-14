export enum ApiKeyType {
	UPLOAD = 0,
	SDK = 1,
}

export const apiKeyTypePairs = {
	[ApiKeyType.UPLOAD]: 'Upload',
	[ApiKeyType.SDK]: 'SDK',
}
