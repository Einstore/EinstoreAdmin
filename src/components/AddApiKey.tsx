import React, { Component, ChangeEvent, FormEvent } from 'react'
import TeamSelect from './TeamSelect'
import TextInput from './textInput'
import './basicForm.sass'
import './recentlyAddedApiKey.sass'
import Button from './button'
import { apiKeyTypePairs } from '../api/types/ApiKeyType'
import map from 'lodash-es/map'
import find from 'lodash-es/find'
import Select from 'react-select'
import IconBack from 'shapes/back'
import showMessage from '../utils/showMessage'
import pageTitle from "../utils/pageTitle";

interface AddApiKeysProps {
	teamId?: string
	apiKeyId?: string
}

interface AddApiKeysState {
	working: boolean
	teams: any
	activeTeam?: string
	editedApiKey?: string
	name: string
	tags: string
	type: number
	recentlyAddedApiKeys: {}
}

export default class AddApiKeys extends Component<AddApiKeysProps, AddApiKeysState> {
	state = {
		working: false,
		teams: [],
		activeTeam: this.props.teamId,
		editingApiKey: this.props.apiKeyId,
		name: '',
		tags: '',
		type: 0,
		recentlyAddedApiKeys: {},
	}

	componentDidMount() {
		window.Einstore.teams().then((teams) => this.setState({ teams }))
		if(this.state.editingApiKey){
			window.Einstore.getApiKey(this.state.editingApiKey).then((apiKey) => {
				console.log('tags', apiKey.tags)
				this.setState({
					activeTeam: apiKey.team_id,
					name: apiKey.name,
					type: apiKey.type,
					tags: apiKey.tags ? apiKey.tags : ''
				})
			})
			pageTitle('Edit API key')
		} else {
			pageTitle('Add new API key')
		}
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

	handleSubmitCreate = (e: FormEvent) => {
		e.preventDefault()

		if (this.state.activeTeam && this.state.name) {
			window.Einstore.createApiKey(this.state.activeTeam, this.state.name, this.state.type)
				.then((newKey: any) => {
					window.recentlyAddedApiKeys = {}
					window.recentlyAddedApiKeys[newKey.id] = newKey.token
					window.history.back()
				})
				.catch((err) => {
					showMessage('API key can not be generated.\n' + err.message)
				})
		} else {
			showMessage('You have to select team and fill API key name.')
		}
	}

	handleSubmitEdit = (e: FormEvent) => {
		e.preventDefault()

		if (this.state.activeTeam && this.state.name && this.state.editingApiKey) {
			let data = {
				name: this.state.name,
				tags: 'tag1, tag2'
			}
			window.Einstore.editApiKey(this.state.editingApiKey, data)
				.then(() => {
					alert('SUCCESS!!!!!!')
					window.location.href = '/api-keys'
				})
				.catch((err) => {
					showMessage('API key can not be saved.\n' + err.message)
				})
		} else {
			showMessage('You have to select team and fill API key name.')
		}
	}

	handleSubmit = (e: FormEvent) => {
		this.setState({ working: true })
		if(this.state.editingApiKey){
			this.handleSubmitEdit(e)
		} else {
			this.handleSubmitCreate(e)
		}
		this.setState({ working: false })
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
									<Button>{this.state.working ? 'Working...' : this.state.editingApiKey ? 'Edit API key' : 'Create API key'}</Button>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
