import { Model } from './Model'

export class Overview implements Model {
	public latest_app_version?: string
	public identifier?: string
	public team_id?: string
	public latest_app_id?: string
	public latest_app_icon?: boolean
	public latest_app_build?: string
	public latest_app_name?: string
	public latest_app_added?: number
	public platform?: string
	public build_count?: number
}
