import { Model } from './Model'

export class AppTag implements Model {
	public id?: string
	public identifier?: string
	public optimistic: boolean = false

	static create(values: object): AppTag {
		return Object.assign(new AppTag(), values)
	}
}
