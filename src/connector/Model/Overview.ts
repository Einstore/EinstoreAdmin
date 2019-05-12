import { Model } from './Model'

export class Overview implements Model {
	public latest_build_version?: string
	public identifier?: string
	public team_id?: string
	public latest_build_id?: string
	public latest_build_icon?: boolean
	public latest_build_build?: string
	public latest_build_name?: string
	public latest_build_added?: number
	public platform?: string
	public build_count?: number
}
