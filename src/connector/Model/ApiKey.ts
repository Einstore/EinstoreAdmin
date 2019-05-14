import { Model } from './Model'

export class ApiKey implements Model {
	public id?: string
	public name?: string
	public team_id?: string
	public token?: string
	public type?: number
	public created?: string

	static create(values: object): ApiKey {
		return Object.assign(new ApiKey(), values)
	}
}
