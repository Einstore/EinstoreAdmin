import React, { FormEvent, ChangeEvent } from 'react'

import './systemSettings.sass'
import Button from '../components/button'
import previewFileImage from '../utils/previewFileImage'

class SystemImageForm extends React.Component<
	{},
	{
		oldValue?: string
		previewValue?: string
	}
> {
	state = {
		oldValue: undefined,
		previewValue: undefined,
	}

	fileInputRef = React.createRef<HTMLInputElement>()

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (this.fileInputRef.current && this.fileInputRef.current.files) {
			for (let i = 0; i < this.fileInputRef.current.files.length; i++) {
				window.Einstore.uploadServerImage(this.fileInputRef.current.files[i]).then(() =>
					window.location.reload()
				)
			}
		}
	}

	componentDidMount() {
		window.Einstore.server().then((s: any) => this.setState({ oldValue: s.icons[5].url }))
	}

	handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.files && e.currentTarget.files.length) {
			previewFileImage(e.currentTarget.files[0]).then((previewValue) =>
				this.setState({ previewValue })
			)
		}
	}

	render() {
		return (
			<form
				action=""
				className="systemSettingsForm view-image"
				method="POST"
				onSubmit={this.handleSubmit}
			>
				<label htmlFor="server-icon">
					<div className="systemSettingsForm-current">
						{this.state.oldValue && !this.state.previewValue && <img src={this.state.oldValue} alt="" />}
						{this.state.previewValue && <img src={this.state.previewValue} alt="" />}
					</div>
					<div className="systemSettingsForm-control">
						<input
							type="file"
							ref={this.fileInputRef}
							id="server-icon"
							onChange={this.handleChange}
						/>
					</div>
				</label>
				<div>
					<Button>Save image</Button>
				</div>
			</form>
		)
	}
}

class SystemConfigForm extends React.Component<{
	config: { id: string; config: string; name: string }
}> {
	state = {
		value: this.props.config.config,
	}
	customTypes = {
		style_header_color: 'color',
		style_primary_action_background_color: 'color',
		style_header_background_color: 'color',
		style_primary_action_color: 'color',
	}
	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		window.Einstore.setServerSettings(
			this.props.config.id,
			this.props.config.name,
			this.state.value
		).then(() => {
			window.dispatchEvent(new Event('refreshServer'))
		})
	}
	handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({ value: e.currentTarget.value })
	}
	render() {
		const { config } = this.props
		const { value } = this.state
		return (
			<form className="systemSettingsForm-control view-configControl" onSubmit={this.handleSubmit}>
				<label className="systemSettingsForm-control-label">{config.name}</label>
				<input
					type={this.customTypes[config.name] || 'text'}
					value={value}
					name={config.id}
					onChange={this.handleChange}
					className="systemSettingsForm-control-input"
				/>
				<div className="systemSettingsForm-control-actions">
					<Button>Save</Button>
				</div>
			</form>
		)
	}
}

class SystemConfigsForm extends React.Component {
	state: { current?: any[] } = {
		current: undefined,
	}
	componentDidMount() {
		window.Einstore.serverSettings().then((current: any) => this.setState({ current }))
	}
	render() {
		return (
			<div className="systemSettingsForm">
				{this.state.current &&
					this.state.current.map((conf: any) => <SystemConfigForm key={conf.id} config={conf} />)}
				<div />
			</div>
		)
	}
}

export default class AddTeam extends React.Component {
	render() {
		return (
			<div className="sheet">
				<div className="sheet-main">
					<h2 className="sheet-title">System settings</h2>
					<SystemImageForm />
					<SystemConfigsForm />
				</div>
			</div>
		)
	}
}
