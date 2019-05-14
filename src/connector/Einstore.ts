import { Config } from './Config'
import { Networking } from './Libs/Networking'
import { ApiKey } from './Model/ApiKey'
import { AppTag } from './Model/AppTag'
import { Auth } from './Model/Auth'
import { Overview } from './Model/Overview'
import { Team } from './Model/Team'
import { Token } from './Model/Token'
import { User } from './Model/User'

import qs from 'query-string'
import { PlatformSwitchValue } from '../components/PlatformSwitch'
import { SearchSuggestion, SearchSuggestionType } from './Model/SearchSuggestion'
import { App } from './Model/App'
import { splitToIdentifiersAndRegularTags } from '../utils/splitToIdentifiersAndRegularTags'

import uniqBy from 'lodash-es/uniqBy'

export class Einstore {
	public networking: Networking

	public _token?: string

	// Initialization

	public constructor(public config: Config, public jwt: string = '') {
		this.networking = new Networking(config)
		if (jwt !== '') {
			this.networking.jwt = jwt
		}
		setInterval(this.refreshAuth, 10 * 60000)
	}

	// Requests

	public auth = (email: string, password: string): Promise<Auth> => {
		const object = {
			email,
			password,
		}
		const promise = this.networking.postJson('/auth', object)
		return promise.then((res) => {
			const jwt = res.headers.get('authorization')
			if (jwt) {
				this.networking.jwt = jwt
				return res
					.json()
					.then((json) => {
						return {
							json,
							jwt,
						}
					})
					.then((data) => {
						const obj = Object.assign(new Auth(), data.json)
						obj.jwt = data.jwt
						return obj
					})
			} else {
				return res.json().then((data: any) => {
					throw new Error(data.description)
				})
			}
		})
	}

	public refreshAuth = () => {
		const token = localStorage.getItem('authToken')
		if (token) {
			this.token(token)
		}
	}

	public token = (token: string): Promise<Token> => {
		const object = {
			token,
		}
		const promise = this.networking.postJson('/token', object)
		return promise
			.then((res) => {
				const jwt = res.headers.get('authorization')
				if (jwt) {
					this.networking.jwt = jwt
					this._token = token
					return res.json().then((json) => {
						localStorage.setItem('authToken', this._token as string)
						localStorage.setItem('token', jwt as string)
						return {
							json,
							jwt,
						}
					})
				} else {
					throw new TypeError('Missing JWT token')
				}
			})
			.then((data) => {
				const obj = Object.assign(new Token(), data.json)
				obj.jwt = data.jwt
				return obj
			})
	}

	public invite = (data: {
		username?: string
		password?: string
		firstname: string
		lastname: string
		email: string
	}): Promise<any> => {
		const promise = this.networking.postJson('/users/invite', data)
		return promise.then((res) => res.json())
	}

	public register = (data: {
		username?: string
		password?: string
		firstname: string
		lastname: string
		email: string
	}): Promise<any> => {
		const promise = this.networking.postJson('/users', data)
		return promise.then((res) => res.json())
	}

	public addUserToTeam = (teamId: string, userId: string): Promise<any> => {
		return this.networking.postJson(`/teams/${teamId}/link`, { id: userId })
	}

	public removeUserFromTeam = (teamId: string, userId: string): Promise<any> => {
		return this.networking.postJson(`/teams/${teamId}/unlink`, { id: userId })
	}

	public teams = async (): Promise<[Team]> => {
		const promise = this.networking.get('/teams')
		const res = await promise
		const json = await res.json()
		return json.map((x: JSON) => Object.assign(new Team(), x))
	}

	public createTeam = async (data: object): Promise<Response> => {
		const promise = this.networking.postJson('/teams', data)
		const res = await promise
		const json = await res.json()
		return json
	}

	public resetPassword = async (email: string): Promise<Response> => {
		const promise = this.networking.postJson('/auth/start-recovery', { email })
		const res = await promise
		const json = await res.json()
		return json
	}

	public ping = (): Promise<Response> => {
		return this.networking.get('/ping')
	}

	public overview = async (
		teamId: string = '',
		limit: number = 10,
		from: number = 1,
		tags?: string[],
		platform?: PlatformSwitchValue,
		sort?: string
	): Promise<[Overview]> => {
		const query: any = {
			limit,
			from,
			sort,
		}
		if (platform && platform !== PlatformSwitchValue.ALL) {
			query.platform = platform
		}
		const promise = this.networking.get(
			teamId === 'all' || teamId.length === 0
				? `/apps?${qs.stringify(query)}`
				: `/teams/${teamId}/apps?${qs.stringify(query)}`
		)
		const res = await promise
		const json = await res.json()
		return json.map((x: JSON) => Object.assign(new Overview(), x))
	}

	public filterApps = async (filter: {
		limit?: number
		tags?: string[] | string
		identifier?: string
	}): Promise<[any]> => {
		filter = { ...filter }
		if (filter.tags) {
			const { identifiers, regularTags } = splitToIdentifiersAndRegularTags(
				typeof filter.tags === 'string' ? [filter.tags] : filter.tags
			)
			filter.tags = regularTags.length ? regularTags.join('|') : undefined
			filter.identifier = identifiers[0] || undefined
		}
		const promise = this.networking.get(`/builds?${qs.stringify(filter)}`)
		const res = await promise
		const json = await res.json()
		return json
	}

	public team = async (team: string): Promise<Response> => {
		const promise = this.networking.get(`/teams/${team}`)
		const res = await promise
		const json = await res.json()
		return json
	}

	public server = async (): Promise<Response> => {
		const promise = this.networking.get('/info')
		const res = await promise
		const json = await res.json()
		return json
	}

	public apps = async (
		platform: string,
		identifier: string,
		limit: number = 20
	): Promise<Response> => {
		const promise = this.networking.get(
			`/builds?platform=${encodeURIComponent(platform)}&identifier=${encodeURIComponent(
				identifier
			)}&limit=${limit}`
		)
		const res = await promise
		const json = await res.json()
		return json
	}

	public appBuilds = async (id: string, limit: number = 10): Promise<Response> => {
		return this.networking.get(`/apps/${id}/builds?limit=${limit}`).then((res) => res.json())
	}

	public deleteApp = async (id: string): Promise<Response> => {
		return this.networking.delete('/apps/' + id)
	}

	public deleteBuild = async (id: string): Promise<Response> => {
		return this.networking.delete('/builds/' + id)
	}

	public addTeam = async (name: string, identifier: string): Promise<Response> => {
		const promise = this.networking.postJson('/teams/', {
			name,
			identifier,
		})
		const res = await promise
		const json = await res.json()
		return json
	}

	public editTeam = async (id: string, data: any): Promise<Response> => {
		const promise = this.networking.putJson(`/teams/${id}`, data)
		const res = await promise
		const json = await res.json()
		return json
	}

	public deleteTeam = async (id: string): Promise<Response> => {
		return this.networking.delete('/teams/' + id)
	}

	public build = async (id: string): Promise<Response> => {
		const promise = this.networking.get(`/builds/${id}`)
		const res = await promise
		const json = await res.json()
		return json
	}

	public upload = async (data: any, team: string): Promise<Response> => {
		console.log('uploading', { data, team })
		const promise = this.networking.postData(`/teams/${team}/builds`, data)
		const res = await promise
		const json = await res.json()
		return json
	}

	public uploadServerImage = async (file: File): Promise<Response> => {
		return this.networking.postData(`/server/image`, file).then((res: any) => {
			if (res.status > 299) {
				return res.json().then((data: any) => {
					const err = new Error('Image upload failed.') as any
					err.ref = data
					throw err
				})
			}
		})
	}

	public uploadTeamIcon = async (teamId: string, file: File): Promise<Response> => {
		return this.networking.postData(`/teams/${teamId}/icon`, file)
	}

	public setServerSettings = async (
		id: string,
		name: string,
		config: string
	): Promise<Response> => {
		const data: any = {
			name,
			config,
		}
		return this.networking.put(`/settings/${id}`, data)
	}

	public serverSettings = async (): Promise<Response> => {
		return this.networking.get(`/settings`).then((res) => res.json())
	}

	public serverSettingsPlain = async (): Promise<Response> => {
		return this.networking.get(`/settings?plain=true`).then((res) => res.json())
	}

	public users = async (query: string): Promise<Response> => {
		const promise = this.networking.get(`/users/global?search=${encodeURIComponent(query)}`)
		const res = await promise
		const json = await res.json()
		return json.map((x: JSON) => Object.assign(new User(), x))
	}

	public teamUsers = async (team: string): Promise<Response> => {
		const promise = this.networking.get(`/teams/${encodeURIComponent(team)}/users`)
		const res = await promise
		const json = await res.json()
		return json.map((x: JSON) => Object.assign(new User(), x))
	}

	public download = async (id: string): Promise<Response> => {
		const promise = this.networking.get('/builds/' + id + '/auth')
		const res = await promise
		const json = await res.json()
		return json
	}

	public downloadCurrentPlatform = async (id: string, platform: string) => {
		const win = window.open('/downloading', 'download') as any
		return this.download(id)
			.then((result: any) => {
				const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
				if (platform === 'ios' && isIos) {
					win.location.href = result.ios
				} else {
					win.location.href = result.file
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	public apiKeys = async (): Promise<ApiKey[]> => {
		const promise = this.networking.get('/keys')
		const res = await promise
		const json = await res.json()
		return json
	}

	public deleteApiKey = (id: string): Promise<Response> => {
		return this.networking.delete(`/keys/${id}`)
	}

	public editApiKey = (id: string, data: any): Promise<Response> => {
		return this.networking.put(`/keys/${id}`, data)
	}

	public updateUser = async (id: string, data: any): Promise<Response> => {
		const promise = this.networking.put(`/users/${id}`, data)
		const res = await promise
		const json = await res.json()
		return json
	}

	public createApiKey = async (team: string, name: string, type: number): Promise<Response> => {
		const promise = this.networking.postJson(`/teams/${team}/keys`, {
			name: name,
			type: type,
		})
		const res = await promise
		const json = await res.json()
		return json
	}

	public getAppTags = async (appId: string): Promise<[AppTag]> => {
		const promise = this.networking.get(`/builds/${appId}/tags`)
		const res = await promise
		const json = await res.json()
		return json.map((x: JSON) => Object.assign(new AppTag(), x))
	}

	public getTagsSuggestions = async (str: string, teamId?: string): Promise<string[]> => {
		const promise = this.networking.get(
			`${teamId ? '/teams/' + teamId : ''}/tags?search=${encodeURIComponent(str)}`
		)
		const res = await promise
		const json = await res.json()
		return json
	}

	public getAppsSuggestions = async (str: string, teamId?: string): Promise<Overview[]> => {
		const promise = this.networking.get(
			`${teamId ? '/teams/' + teamId : ''}/apps?search=${encodeURIComponent(str)}`
		)
		const res = await promise
		const json = await res.json()
		return json
	}

	public getSuggestions = async (str: string, teamId?: string): Promise<SearchSuggestion[]> => {
		const [apps, tags] = await Promise.all([
			this.getAppsSuggestions(str, teamId),
			this.getTagsSuggestions(str, teamId),
		])

		const result: SearchSuggestion[] = []

		for (const app of uniqBy(apps, 'identifier')) {
			result.push({
				type: SearchSuggestionType.APP,
				current: App.create({
					team_id: app.team_id,
					id: app.latest_build_id,
					identifier: app.identifier,
					icon: app.latest_build_icon,
					name: app.latest_build_name,
					version: app.latest_build_version,
					platform: app.platform,
				}),
			})
		}

		for (const tag of tags) {
			result.push({
				type: SearchSuggestionType.TAG,
				current: AppTag.create({ identifier: tag }),
			})
		}

		return result.slice(0, 100)
	}

	public addAppTag = async (appId: string, tag: string): Promise<Response> => {
		const promise = this.networking.postJson(`/builds/${appId}/tags`, [tag])
		const res = await promise
		const json = await res.json()
		return json.map((x: JSON) => Object.assign(new AppTag(), x))
	}

	public deleteBuildTag = (appId: string, tagId: string): Promise<Response> => {
		const promise = this.networking.delete(`/builds/${appId}/tags/${tagId}`)
		promise.then(console.log)
		promise.catch(console.warn)
		return new Promise((resolve) => {
			setTimeout(resolve, 100)
			promise.then(resolve)
		})
	}

	public me = async (): Promise<Response> => {
		const promise = this.networking.get(`/users/me`)
		const res = await promise
		return res.json().then((me) => {
			return this.amISuperAdmin().then((isAdmin) => ({ ...me, isAdmin }))
		})
	}

	public amISuperAdmin = async (): Promise<boolean> => {
		return this.teams().then((teams) => {
			for (let team of teams) {
				if (team.admin) {
					return true
				}
			}
			return false
		})
	}

	public commonTags = async (teamId?: string): Promise<Response> => {
		const promise = this.networking.get(teamId ? `/teams/${teamId}/tags/common` : `/tags/common`)
		const res = await promise
		return res.json()
	}

	public authViaGithub = () => {
		const link = `${window.location.origin}/github-auth-result`
		window.location.href = `${
			this.networking.config.url
		}/auth/github/login?link=${encodeURIComponent(link)}`
	}
}
