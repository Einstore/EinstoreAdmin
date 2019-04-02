import { Model } from './Model'
import { AppTag } from './AppTag'
import { App } from './App'

export enum SearchSuggestionType {
	APP = 'app',
	TAG = 'tag',
}

export class SearchSuggestion implements Model {
	public current?: App | AppTag
	public type?: SearchSuggestionType

	static create(values: object): SearchSuggestion {
		return Object.assign(new SearchSuggestion(), values)
	}
}
