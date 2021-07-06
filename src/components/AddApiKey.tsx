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
import IconTimes from "../shapes/times";

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
	tags: string[]
	type: number
	recentlyAddedApiKeys: {}
	newTag: string
}

export default class AddApiKeys extends Component<AddApiKeysProps, AddApiKeysState> {
	state = {
		working: false,
		teams: [],
		activeTeam: this.props.teamId,
		editingApiKey: this.props.apiKeyId,
		name: '',
		tags: [],
		type: 0,
		recentlyAddedApiKeys: {},
		newTag: '',
	}

	componentDidMount() {
		window.Einstore.teams().then((teams) => this.setState({ teams }))
		if(this.state.editingApiKey){
			window.Einstore.getApiKey(this.state.editingApiKey).then((apiKey) => {
				this.setState({
					activeTeam: apiKey.team_id,
					name: apiKey.name,
					type: apiKey.type,
					tags: apiKey.tags ? 'tag1,tag2,tag3'.split(',') : []
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

	handleChangeTagName = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({ newTag: e.target.value })
	}


	handleAddTag = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState(state => {
			const newTags = state.tags.concat(state.newTag).slice()
			return {
				tags: newTags,
				newTag: ''
			}
		})
	}

	handleRemoveTag = (index: number) => {
		this.setState(state => {
			let tags = state.tags
			tags.splice(index, 1)
			return {
				tags: tags,
				newTag: ''
			}
		})
	}

	handleChangeType = (value: any) => {
		this.setState({ type: Number(value.value) })
	}

	handleSubmitCreate = (e: FormEvent) => {
		e.preventDefault()

		if (this.state.activeTeam && this.state.name) {
			window.Einstore.createApiKey(this.state.activeTeam, this.state.name, this.state.tags.join(','), this.state.type)
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
				tags: this.state.tags.join(',')
			}
			console.log('editApiKey', this.state.editingApiKey, data)
			window.Einstore.editApiKey(this.state.editingApiKey, data)
				.then(() => {
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
		const {editingApiKey} = this.state

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
								{!this.props.teamId && !editingApiKey && (
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
								<TextInput
									onChange={this.handleChangeTagName}
									value={this.state.newTag}
									placeholder={'Tags'}
								/>
								<Button
									type={'button'}
									onClick={this.handleAddTag}
								>Add tag</Button>
								<div className="card-filtering-list">
								{this.state.tags.map((tag, index) =>
									<div
										key={index}
										className={`card-filtering-item`}
									>
										{tag}{' '}
										<span role="button" onClick={() => this.handleRemoveTag(index)}>
										<IconTimes />
									</span>
									</div>
								)}
								</div>

								<small>
									* (SDK) Only offer builds marked with above tags / (Upload) Automatically create
									above tags for uploaded builds
								</small>
								<Select
									placeholder="Select type"
									isSearchable={false}
									onChange={this.handleChangeType}
									value={find(typeOptions, (opt: any) => opt.value === this.state.type)}
									options={typeOptions}
								/>
								<div className="card-actions">
									<Button>{this.state.working ? 'Working...' : editingApiKey ? 'Edit API key' : 'Create API key'}</Button>
								</div>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
