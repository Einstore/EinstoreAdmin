import { Link } from '@reach/router'
import React, { ChangeEvent, FormEvent } from 'react'
import Button from '../components/button'
import '../components/form.sass'
import TextInput from '../components/textInput'
import { Auth } from '../connector/Model/Auth'
import { Token } from '../connector/Model/Token'
import '../parts/login.sass'
import { ServerIcon } from '../components/ServerIcon'
import IconEnter from '../shapes/enter'
import IconInfo from '../shapes/info'
import IconNewUser from '../shapes/newUser'
import { ServerContext } from '../App'
import { Authenticator, AuthenticatorType } from 'connector/Einstore'
import getContrastColor from '../utils/getContrastColor'

import './Login.sass'
import { ReactComponent as GithubIcon } from '@fortawesome/fontawesome-free/svgs/brands/github.svg'
import { ReactComponent as GitlabIcon } from '@fortawesome/fontawesome-free/svgs/brands/gitlab.svg'
import showMessage from "../utils/showMessage";

const oauthIcons = {
	github: <GithubIcon />,
	gitlab: <GitlabIcon />,
}

interface LoginProps {
	onSuccess?: (auth: Auth, token: Token) => void
	icon?: any
}

interface LoginState {
	email: string
	password: string
	showError: boolean
	working: boolean
	authenticators?: Authenticator[]
}

const prefilled =
	window.PREFILLED_CREDENTIALS && window.PREFILLED_CREDENTIALS.indexOf(':') > -1
		? window.PREFILLED_CREDENTIALS.split(':')
		: ['', '']

const prefilledEmail = prefilled[0] || ''
const prefilledPassword = prefilled[1] || ''

export default class Login extends React.Component<LoginProps, LoginState> {
	state: LoginState = {
		email: prefilledEmail,
		password: prefilledPassword,
		showError: false,
		working: false,
	}

	createBasicLoginHandler = (a: Authenticator) => (event: FormEvent) => {
		event.preventDefault()
		if (window.Einstore && this.state.email && this.state.password) {
			this.setState({ working: true })
			const mem: { auth?: Auth; token?: Token } = {}
			const auth = window.Einstore.basicAuth(a.button, this.state.email, this.state.password)

			auth
				.then((auth: Auth) => {
					mem.auth = auth
					return window.Einstore.token(auth.token || '')
				})
				.then((token: Token) => {
					mem.token = token
					if (mem.token && mem.auth && this.props.onSuccess) {
						this.props.onSuccess(mem.auth, mem.token)
					}
				})
				.then(() => {
					this.setState({ working: false })
				})
				.catch((e: any) => {
					showMessage(e.message)
					this.setState({ working: false })
				})
		} else {
			showMessage('You have to fill in E-mail and Password.')
		}
	}

	componentDidMount() {
		this.fetchAuthenticators()
	}

	handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		this.setState({ [event.target.name]: event.target.value } as any)
	}

	fetchAuthenticators = () => {
		window.Einstore.authenticators().then((authenticators) => this.setState({ authenticators }))
	}

	createOauthLoginHandler = (a: Authenticator) => {
		return (e: MouseEvent) => {
			window.Einstore.startOauth(a)
		}
	}

	renderAuthenticator = (a: Authenticator) => {
		switch (a.type) {
			case AuthenticatorType.OAUTH:
				return (
					<div key={a.identifier} className="login-oauth">
						<Button
							type="button"
							onClick={this.createOauthLoginHandler(a)}
							className="view-oauth"
							style={{
								backgroundColor: `#${a.color}`,
								color: a.color && getContrastColor(a.color),
							}}
						>
							{oauthIcons[a.identifier] || <IconEnter />}
							{a.name}
						</Button>
					</div>
				)
			case AuthenticatorType.BASIC:
				return (
					<div key={a.identifier} className="login-basic">
						<form onSubmit={this.createBasicLoginHandler(a)} className="form">
							<fieldset disabled={this.state.working}>
								<div className="form-icon">
									<ServerIcon />
								</div>
								<TextInput
									name="email"
									type="email"
									placeholder="E-mail"
									value={this.state.email}
									onChange={this.handleChange}
								/>
								<TextInput
									name="password"
									type="password"
									placeholder="Password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
								<div className="login-texts">
									{this.state.showError === true ? (
										<div className="login-error">
											<IconInfo color="#ff0000" /> Incorrect credentials
										</div>
									) : null}
								</div>
								<div className="login-links">
									<ServerContext.Consumer>
										{(server) => (
											<>
												<div className="login-links-left">
													{server && server.config.allow_registrations ? (
														<Link className="login-link" to="/register">
															<IconNewUser /> Register
														</Link>
													) : (
														<span className="login-link" />
													)}

													<Link className="login-link" to="/reset-password">
														Reset password
													</Link>
												</div>

												<div className="login-links-right">
													<Button>
														<IconEnter /> Login
													</Button>
												</div>
											</>
										)}
									</ServerContext.Consumer>
								</div>
							</fieldset>
						</form>
					</div>
				)
			default:
				return null
		}
	}

	render() {
		return (
			<div className="login">
				{this.state.authenticators && this.state.authenticators.map(this.renderAuthenticator)}
			</div>
		)
	}
}
