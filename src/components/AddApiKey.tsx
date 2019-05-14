import React, { Component, ChangeEvent, FormEvent } from 'react'
import TeamSelect from './TeamSelect'
import TextInput from './textInput'
import './basicForm.sass'
import './recentlyAddedApiKey.sass'
import Button from './button'
import TeamName from './TeamName'

interface AddApiKeysProps {
	teamId?: string
}

interface AddApiKeysState {
	working: boolean
	teams: any
	activeTeam?: string
	name: string
	type: number
	recentlyAddedApiKeys: any[]
}

function RecentlyAddedApiKey({ id, name, type, team_id, token }: any) {
	return (
		<div className="card">
			<div className="card-content">
				<div className="recentlyAddedApiKey">
					<table className="recentlyAddedApiKey-values">
						<tbody>
							<tr>
								<th>Name / note:</th>
								<td>
									<TeamName teamId={team_id} /> / <strong>{name}</strong>
								</td>
							</tr>
							<tr>
								<th>Type:</th>
								<td>
									<span
										className={
											type == 0 ? 'apiKey-type-round-label-upload' : 'apiKey-type-round-label-sdk'
										}
									>
										{type == 0 ? 'Upload' : 'SDK'}
									</span>
								</td>
							</tr>
							<tr>
								<th>Token:</th>
								<td>
									<code className="important">{token}</code>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default class AddApiKeys extends Component<AddApiKeysProps, AddApiKeysState> {
	state = {
		working: false,
		teams: [],
		activeTeam: this.props.teamId,
		name: '',
		type: 0,
		recentlyAddedApiKeys: [],
	}

	componentDidMount() {
		window.Einstore.teams().then((teams) => this.setState({ teams }))
	}

	handleChangeTeam = (value: string) => {
		this.setState({ activeTeam: value })
	}

	handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({ name: e.target.value })
	}

	handleChangeType = (event: React.FormEvent<HTMLSelectElement>) => {
		const element = event.target as HTMLSelectElement
		this.setState({ type: parseInt(element.value) })
	}

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (this.state.activeTeam && this.state.name) {
			this.setState({ working: true })
			window.Einstore.createApiKey(this.state.activeTeam, this.state.name, this.state.type).then(
				(newKey: any) => {
					this.setState((state) => ({
						...state,
						name: '',
						type: 0,
						working: false,
						recentlyAddedApiKeys: [...state.recentlyAddedApiKeys, newKey],
					}))
				}
			)
		}
	}

	render() {
		return (
			<div className="page">
				<div className="recentlyAddedApiKeys">
					{this.state.recentlyAddedApiKeys.map((key: any) => (
						<RecentlyAddedApiKey key={key.id} {...key} />
					))}
				</div>
				<div className="card">
					<div className="card-content">
						<form className="basicForm" onSubmit={this.handleSubmit}>
							<fieldset disabled={this.state.working}>
								<TeamSelect
									teams={this.state.teams}
									activeTeam={this.state.activeTeam}
									onChangeTeam={this.handleChangeTeam}
								/>
								<TextInput
									onChange={this.handleChangeName}
									value={this.state.name}
									placeholder={'Name / note'}
								/>
								<select name="type" onChange={this.handleChangeType}>
									<option value="0">Upload</option>
									<option value="1">SDK</option>
								</select>
								<div>
									<Button>{this.state.working ? 'Creating...' : 'Create API key'}</Button>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
