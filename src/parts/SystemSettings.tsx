import React, { FormEvent, ChangeEvent, useState, useCallback } from 'react'
import './systemSettings.sass'
import Button from '../components/button'
import previewFileImage from '../utils/previewFileImage'
import IconField from 'ui/IconField'
import pageTitle from "../utils/pageTitle";

function TemplatorUpdate() {
	const [isWorking, setIsWorking] = useState(false)
	const onClick = useCallback((e: MouseEvent) => {
		e.preventDefault()
		setIsWorking(true)
		window.Einstore.registerAllAvailableTemplates().then(() => {
			setIsWorking(false)
		})
	}, [])
	return (
		<div className="TemplatorUpdate">
			<Button onClick={isWorking ? undefined : onClick}>
				{isWorking ? 'Updating...' : 'Trigger update of email and API forms templates.'}
			</Button>
		</div>
	)
}

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
				window.Einstore.uploadServerImage(this.fileInputRef.current.files[i])
					.then(() => window.location.reload())
					.catch((err) => {
						alert(err)
					})
			}

			this.fileInputRef.current.value = ''
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

	handleDiscardNewImage = (e: MouseEvent) => {
		e.preventDefault()
		this.setState({ previewValue: undefined })
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
						<IconField
							oldValue={this.state.oldValue}
							newValue={this.state.previewValue}
							onClickOld={this.state.previewValue && this.handleDiscardNewImage}
						/>
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
	styleNames = {
		style_primary_action_color: 'Primary action color',
		style_primary_action_background_color: 'Primary action background color',
		style_header_color: 'Header color',
		style_header_background_color: 'Header background color',
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
			<form className="account-form-item" onSubmit={this.handleSubmit}>
				<label className="account-form-item-label">{this.styleNames[config.name] || config.name}</label>
				<input
					type={this.customTypes[config.name] || 'text'}
					value={value}
					name={config.id}
					onChange={this.handleChange}
					className="systemSettingsForm-control-input"
				/>
				<div className="systemSettingsForm-control-actions">
					<Button className="button-sm">Save</Button>
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
			<div className="account-form">
				{this.state.current &&
					this.state.current.map((conf: any) => <SystemConfigForm key={conf.id} config={conf} />)}
				<div />
			</div>
		)
	}
}

export default class SystemSettings extends React.Component {
	componentDidMount(): void {
		pageTitle('System settings')
	}

	render() {
		return (
			<div className="sheet">
				<div className="sheet-main">
					<h2 className="sheet-title">System settings</h2>
					<SystemImageForm />
					<SystemConfigsForm />
					<TemplatorUpdate />
				</div>
			</div>
		)
	}
}
