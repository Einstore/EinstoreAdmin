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
	recentlyAddedApiKeys: any[]
}

function RecentlyAddedApiKey({ id, name, team_id, token }: any) {
	return (
		<div className="card">
			<div className="card-content">
				<div className="recentlyAddedApiKey">
					<table className="recentlyAddedApiKey-values">
						<tbody>
							<tr>
								<th>Name / note:</th>
								<td>
									<TeamName teamId={team_id} /> / <code>{name}</code>
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
		recentlyAddedApiKeys: [],
	}

	componentDidMount() {
		window.Boost.teams().then((teams) => this.setState({ teams }))
	}

	handleChangeTeam = (value: string) => {
		this.setState({ activeTeam: value })
	}

	handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({ name: e.target.value })
	}

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (this.state.activeTeam && this.state.name) {
			this.setState({ working: true })
			window.Boost.createApiKey(this.state.activeTeam, this.state.name).then((newKey: any) => {
				this.setState((state) => ({
					...state,
					name: '',
					working: false,
					recentlyAddedApiKeys: [...state.recentlyAddedApiKeys, newKey],
				}))
			})
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
