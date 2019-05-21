import React, { ChangeEvent, FormEvent } from 'react'

import './systemSettings.sass'
import Button from '../components/button'
import TeamName from '../components/TeamName'
import TextInput from '../components/textInput'
import pick from 'lodash-es/pick'
import previewFileImage from '../utils/previewFileImage'
import IconField from 'ui/IconField'
import memoize from 'lodash-es/memoize'

interface EditTeamProps {
	teamId: string
}

interface EditTeamState {
	current: any
	changed: any
	newIcon?: File
	newIconPreview?: string
	oldIconPreview?: string
}

export default class EditTeam extends React.Component<EditTeamProps, EditTeamState> {
	state: EditTeamState = {
		current: undefined,
		changed: {},
		newIcon: undefined,
		newIconPreview: undefined,
	}

	editable = ['name', 'identifier']

	customTypes = {
		color: 'color',
	}

	filters = {
		color: {
			in(val: string) {
				if (val) {
					return '#' + val
				}
				return val
			},
			out(val: string) {
				if (val) {
					return val.substr(1).toUpperCase()
				}
				return val
			},
		},
	}

	componentDidMount() {
		window.Einstore.team(this.props.teamId).then((team: any) =>
			this.setState({ current: team, changed: pick(team, this.editable) }, () => {
				if (team.icon) {
					this.loadOldIconPreview(team.id)
				}
			})
		)
	}

	loadOldIconPreview = memoize(
		(id: string) => {
			const url = `/teams/${id}/icon`
			return window.Einstore.networking
				.memoizedGet(url)
				.then((res: Response) => {
					if (res.status === 500) {
						throw new Error(`500 error in image loading ${url}`)
					}
					this.setState({ oldIconPreview: res.url })
				})
		},
		(id) => id
	)

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		const promises = []

		promises.push(
			window.Einstore.editTeam(this.props.teamId, pick(this.state.changed, this.editable))
		)

		if (this.state.newIcon) {
			promises.push(window.Einstore.uploadTeamIcon(this.props.teamId, this.state.newIcon))
		}

		Promise.all(promises).then(() => {
			window.location.reload()
		})
	}

	handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget
		this.setValue(name, value)
	}

	handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files
		if (files && files.length) {
			this.setState({ newIcon: files[0] })
			this.loadNewIconPreview(files[0])
			e.currentTarget.value = ''
		}
	}

	handleIconDiscard = (e: MouseEvent) => {
		e.preventDefault()
		this.setState({ newIcon: undefined, newIconPreview: undefined })
	}

	loadNewIconPreview = (file: File) => {
		previewFileImage(file).then((url) => this.setState({ newIconPreview: url }))
	}

	getValue = (key: string) => {
		const val = this.state.changed[key] || ''
		if (this.filters[key]) {
			return this.filters[key].in(val)
		}
		return val
	}

	setValue(key: string, value: string | null) {
		if (!value) {
			value = null
		}
		if (this.filters[key]) {
			value = this.filters[key].out(value)
		}
		this.setState((state) => ({ ...state, changed: { ...state.changed, [key]: value } }))
	}

	render() {
		const { current } = this.state
		const iconUrl = this.state.newIconPreview
		const oldIconUrl = this.state.oldIconPreview
		return (
			<div className="sheet">
				{current && (
					<div className="sheet-main">
						<div className="sheet-title" style={{ textAlign: 'center' }}>
							Edit team <TeamName teamId={this.props.teamId} />
						</div>
						<form action="" onSubmit={this.handleSubmit}>
							<div className="systemSettingsForm view-image">
								<label htmlFor="server-icon">
									<div className="systemSettingsForm-current">
										<IconField
											color={current.color}
											placeholder={current.initials}
											oldValue={oldIconUrl}
											newValue={iconUrl}
											onClickOld={this.handleIconDiscard}
										/>
									</div>
									<div className="systemSettingsForm-control">
										<input type="file" id="server-icon" onChange={this.handleIconChange} />
									</div>
								</label>
							</div>
							{this.editable.map((key) => (
								<div
									key={key}
									className="systemSettingsForm-control view-configControl"
									onSubmit={this.handleSubmit}
								>
									<label className="systemSettingsForm-control-label">{key}</label>
									<span className="systemSettingsForm-control-input">
										<TextInput
											type={this.customTypes[key] || 'text'}
											value={this.getValue(key)}
											name={key}
											onChange={this.handleChange}
										/>
									</span>
								</div>
							))}
							<Button>Save changes</Button>
						</form>
					</div>
				)}
			</div>
		)
	}
}
