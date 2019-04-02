import { Model } from './Model'

export class Team implements Model {
	public id?: string
	public name?: string
	public identifier?: string
	public admin?: boolean
	public color?: string
	public initials?: string
	public icon?: boolean
}
