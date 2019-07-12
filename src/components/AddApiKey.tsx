import React, { Component, ChangeEvent, FormEvent } from 'react'
import TeamSelect from './TeamSelect'
import TextInput from './textInput'
import './basicForm.sass'
import './recentlyAddedApiKey.sass'
import Button from './button'
import { ApiKeyType, apiKeyTypePairs } from '../api/types/ApiKeyType'
import map from 'lodash-es/map'
import find from 'lodash-es/find'
import Select from 'react-select'
import IconBack from 'shapes/back'
import showMessage from '../utils/showMessage'

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

const apiKeyTypeClassnames = {
	[ApiKeyType.UPLOAD]: 'apiKey-type-round-label-upload',
	[ApiKeyType.SDK]: 'apiKey-type-round-label-sdk',
}

function RecentlyAddedApiKey({ id, name, type, team_id, token }: any) {
	return (
		<div className="card">
			<div className="card-content">
				<div className="recentlyAddedApiKey">
					<table className="recentlyAddedApiKey-values">
						<tbody>
							<tr>
								<th>Name:</th>
								<td>
									<strong>{name}</strong>
								</td>
							</tr>
							<tr>
								<th>Type:</th>
								<td>
									<span className={apiKeyTypeClassnames[type]}>{apiKeyTypePairs[type]}</span>
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

	handleChangeType = (value: any) => {
		this.setState({ type: Number(value.value) })
	}

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (this.state.activeTeam && this.state.name) {
			this.setState({ working: true })
			window.Einstore.createApiKey(this.state.activeTeam, this.state.name, this.state.type)
				.then((newKey: any) => {
					this.setState((state) => ({
						...state,
						name: '',
						type: 0,
						working: false,
						recentlyAddedApiKeys: [...state.recentlyAddedApiKeys, newKey],
					}))
				})
				.catch((err) => {
					this.setState({ working: false })
					showMessage('API key can not be generated.\n' + err.message)
				})
		} else {
			showMessage('You have to select team and fill API key name.')
		}
	}

	render() {
		const typeOptions: { label: string; value: number }[] = []

		map(apiKeyTypePairs, (label, value) => typeOptions.push({ label, value: Number(value) }))

		return (
			<div className="page">
				<div className="page-controls">
					<div className="page-control is-active" onClick={() => window.history.back()}>
						<IconBack /> Back
					</div>
				</div>
				<div className="recentlyAddedApiKeys">
					{this.state.recentlyAddedApiKeys.map((key: any) => (
						<RecentlyAddedApiKey key={key.id} {...key} />
					))}
				</div>
				<div className="card">
					<div className="card-content">
						<form className="basicForm" onSubmit={this.handleSubmit}>
							<fieldset disabled={this.state.working}>
								{!this.props.teamId && (
									<TeamSelect
										teams={this.state.teams}
										activeTeam={this.state.activeTeam}
										onChangeTeam={this.handleChangeTeam}
									/>
								)}
								<TextInput
									onChange={this.handleChangeName}
									value={this.state.name}
									placeholder={'Name'}
								/>
								<Select
									placeholder="Select type"
									isSearchable={false}
									onChange={this.handleChangeType}
									value={find(typeOptions, (opt: any) => opt.value === this.state.type)}
									options={typeOptions}
								/>
								<div className="card-actions">
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
