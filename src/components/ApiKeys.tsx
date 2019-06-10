import React, { Component, ChangeEvent, FormEvent } from 'react'
import '../components/card.sass'
import { ApiKey } from '../connector/Model/ApiKey'
import '../parts/api.sass'
import IconPen from '../shapes/pen'
import IconTrash from '../shapes/trash'
import TeamName from './TeamName'
import Tag from './Tag'
import usure from '../utils/usure'
import TextInput from './textInput'
import Button from './button'
import prettyDate from '../utils/prettyDate'
import { ApiKeyType, apiKeyTypePairs } from '../api/types/ApiKeyType'
import { Link } from '@reach/router'
import IconPlus from 'shapes/plus'
import filter from 'lodash-es/filter'

const apiKeyTypeClassnames = {
	[ApiKeyType.UPLOAD]: 'apiKey-type-round-label-upload',
	[ApiKeyType.SDK]: 'apiKey-type-round-label-sdk',
}

interface RowProps {
	name?: string
	tags?: string
	id?: string
	team?: string
	created?: string
	token?: string
	type?: ApiKeyType
	globalTeamId?: string
	onDeleteKey: (id: string) => void
	onChange?: (data: { name: string | null; id: string; type?: number }) => void
}

export class Row extends React.Component<RowProps> {
	state = {
		editing: false,
		name: null,
	}

	handleDelete = () => {
		usure('Are you sure you want to delete this API key.').then(() => {
			if (this.props.id) {
				this.props.onDeleteKey(this.props.id)
			}
		})
	}

	handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({ name: e.target.value })
	}

	handleEditSubmit = (e: FormEvent) => {
		e.preventDefault()
		this.setState({ editing: false })

		if (this.props.onChange && this.props.id) {
			this.props.onChange({
				id: this.props.id,
				name: this.state.name,
				type: this.props.type,
			})
		}
	}

	inputRef = (ref?: HTMLInputElement) => ref && ref.select()

	render() {
		const typeName =
			typeof this.props.type !== 'undefined' ? apiKeyTypePairs[this.props.type] : 'none'
		const typeClassname =
			typeof this.props.type !== 'undefined'
				? apiKeyTypeClassnames[this.props.type]
				: 'apiKey-type-round-label-none'

		return (
			<tr>
				{!this.props.globalTeamId && (
					<td>{this.props.team && <TeamName teamId={this.props.team} iconSize={32} />}</td>
				)}
				<td>
					{this.state.editing ? (
						<form className="card-editApiNameForm" onSubmit={this.handleEditSubmit}>
							<TextInput
								value={this.state.name}
								onChange={this.handleNameChange}
								inputRef={this.inputRef}
							/>
							<Button>Save</Button>
						</form>
					) : (
						<span onClick={() => this.setState({ editing: true, name: this.props.name })}>
							{this.props.name}
						</span>
					)}
				</td>
				<td className="apiKey-type" title={typeName}>
					<span className={typeClassname}>{typeName}</span>
				</td>
				<td className="apiKey-tags">
					{this.props.tags && (
						<span>
							{filter(this.props.tags.split(',')).map((tag: string) => (
								<Tag value={tag} />
							))}
						</span>
					)}
				</td>
				<td className="apiKey-date" title={this.props.created}>
					{this.props.created && prettyDate(this.props.created)}
				</td>
				<td>
					<span
						className="api-action api-action-blue"
						onClick={() => this.setState({ editing: true, name: this.props.name })}
					>
						<IconPen /> Edit
					</span>
					<span className="api-action api-action-red" onClick={this.handleDelete}>
						<IconTrash /> Delete
					</span>
				</td>
			</tr>
		)
	}
}

interface ApiKeysProps {
	teamId?: string
}

interface ApiKeysState {
	keys: ApiKey[]
}

export default class ApiKeys extends Component<ApiKeysProps, ApiKeysState> {
	state = {
		keys: [],
	}

	componentDidMount() {
		this.refresh()
	}

	handleDeleteKey = (id: string) => {
		window.Einstore.deleteApiKey(id).then(() => {
			this.refresh()
		})
	}

	handleChangeKey = (data: any) => {
		window.Einstore.editApiKey(data.id, { name: data.name, tags: data.tags, type: data.type }).then(
			() => {
				this.refresh()
			}
		)
	}

	refresh = () => {
		window.Einstore.apiKeys()
			.then((result) => {
				this.setState({
					keys: result,
				})
			})
			.catch((e) => {
				console.error(e)
			})
	}

	render() {
		return (
			<div className="page">
				{this.state.keys.length > 0 ? (
					<div className="card">
						<div className="card-content">
							<table className="api">
								<thead>
									<tr>
										{!this.props.teamId && <td>Team</td>}
										<td>Name/note</td>
										<td>Type</td>
										<td>Tags</td>
										<td>Created</td>
										<td>Actions</td>
									</tr>
								</thead>
								<tbody>
									{this.state.keys.map((item: ApiKey) => {
										return (
											<Row
												onDeleteKey={this.handleDeleteKey}
												onChange={this.handleChangeKey}
												key={item.id}
												name={item.name}
												tags={item.tags}
												type={item.type}
												created={item.created}
												id={item.id}
												team={item.team_id}
												globalTeamId={this.props.teamId}
											/>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div className="page-upload">
						<p className="page-upload-text">Create your first API key here.</p>
						{this.props.teamId && (
							<div>
								<Link
									to={this.props.teamId ? `/add-api-key/${this.props.teamId}` : `/add-api-key`}
									className="button"
								>
									<span>
										<IconPlus /> Add
									</span>
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		)
	}
}
