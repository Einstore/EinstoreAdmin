import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { Link } from 'react-router-dom'
import IconBars from '../shapes/bars'
import IconPlus from '../shapes/plus'
import IconTimes from '../shapes/times'
import Button from './button'
import './header.sass'
import TextInput from './textInput'

export default class Header extends Component {
	state = {
		upload: false,
		icon: this.props.icon,
		isMoved: false,
		filteringIsVisible: false,
		platform: 'android',
		showApiModal: false,
	}

	componentDidMount() {
		if (this.context.token.length === 0) {
			this.props.onLoggedOut(401)
		}

		const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
		if (isIos) {
			// download for ios
			this.setState({
				platform: 'ios',
			})
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.setState({
				isMoved: this.props.isMoved,
				filteringIsVisible: this.props.filteringIsVisible,
				buttonType: this.props.buttonType,
			})
			console.log(this.state.buttonType)
		}
	}

	onAccept = () => {
		console.log('onAccept')
		window.location.reload()
		this.setState({
			upload: false,
		})
	}

	showUpload = () => {
		this.setState({
			upload: true,
		})
	}

	handleDrop = (acceptedFiles, rejectedFiles) => {
		console.log('handleDrop', { acceptedFiles }, this.state.upload)
		if (this.state.upload === false) {
			if (acceptedFiles.length !== 0) {
				this.showUpload()
				this.context.connector
					.upload(acceptedFiles[0], window.rootApp.state.team)
					.then((result) => {
						if (typeof result.error !== 'undefined') {
							throw new Error()
						}
						console.log(result)
					})
					.catch((error) => {
						console.log(error)
					})
					.then(() => {
						this.onAccept()
					})
			}
		}
	}

	handleApiModal = () => {
		this.setState({
			showApiModal: !this.state.showApiModal,
		})
	}

	handleApiKeyCreation = (e) => {
		e.preventDefault()
		const form = new FormData(e.target)
		this.context.connector
			.createApiKey(this.context.team, form.get('name'))
			.then((result) => {
				return result.json()
			})
			.then((result) => {
				this.context.apiKeyCallback(result)
				this.handleApiModal()
			})
			.catch((err) => {
				console.error(err)
			})
	}

	render() {
		return (
			<header className={'header'}>
				<div className="header-part header-menu">
					<div onClick={this.props.toggleMenu}>
						{this.state.isMoved === true ? <IconTimes /> : <IconBars />}
					</div>
				</div>
				<div className="header-part header-logo">
					<Link className="header-logo-link" to={'/'}>
						<img
							src={this.context.icons[64]}
							srcSet={`${this.context.icons[64]}, ${this.context.icons[128]} 2x`}
							alt={this.context.name}
						/>
					</Link>
				</div>
				<div className="header-part header-buttons">
					{this.props.buttonType === 'addBuild' ? (
						<Dropzone className="none" onDrop={this.handleDrop}>
							<Button>
								<IconPlus />
								<span>
									Add <span className="hide-xs">new</span> build
								</span>
							</Button>
						</Dropzone>
					) : this.props.buttonType === 'addApiKey' ? (
						<Button onClick={this.handleApiModal}>
							<IconPlus />
							<span>Create API key</span>
						</Button>
					) : null}
				</div>
				{this.state.showApiModal ? (
					<div className="switch">
						<div className="switch-close" onClick={this.handleApiModal} />
						<div className="switch-inner">
							<div className="switch-header">
								<div className="switch-header-close" onClick={this.handleApiModal}>
									<IconTimes />
								</div>
								<div className="switch-header-title">Create API key</div>
							</div>
							<form className="form" onSubmit={this.handleApiKeyCreation}>
								<TextInput placeholder="API key name" name="name" />
								<Button type="submit">Save</Button>
							</form>
						</div>
					</div>
				) : null}
			</header>
		)
	}
}

Header.contextTypes = {
	connector: PropTypes.object,
	token: PropTypes.string,
	team: PropTypes.string,
	name: PropTypes.string,
	icons: PropTypes.object,
	apiKeyCallback: PropTypes.func,
}
