import { Model } from './Model'

export class App implements Model {
	public build?: string
	public icon?: boolean
	public id?: string
	public size?: number
	public platform?: string
	public team_id?: string
	public version?: string
	public identifier?: string
	public created?: number
	public name?: string

	static create(values: object): App {
		return Object.assign(new App(), values)
	}
}
