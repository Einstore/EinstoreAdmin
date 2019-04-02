import { Link } from '@reach/router'
import React, { ChangeEvent, FormEvent } from 'react'
import Button from '../components/button'
import '../components/form.sass'
import TextInput from '../components/textInput'
import { Auth } from '../connector/Model/Auth'
import { Token } from '../connector/Model/Token'
import '../parts/login.sass'
import { ServerIcon } from '../ServerIcon'
import IconEnter from '../shapes/enter'
import IconInfo from '../shapes/info'
import IconNewUser from '../shapes/newUser'
import { ServerContext } from '../App'

interface LoginProps {
	onSuccess?: (auth: Auth, token: Token) => void
	icon?: any
}

interface LoginState {
	email: string
	password: string
	showError: boolean
	working: boolean
}

export default class Login extends React.Component<LoginProps, LoginState> {
	state = {
		email: '',
		password: '',
		showError: false,
		working: false,
	}

	handleLogin = (event: FormEvent) => {
		event.preventDefault()
		if (window.Boost && this.state.email && this.state.password) {
			this.setState({ working: true })
			const mem: { auth?: Auth; token?: Token } = {}
			window.Boost.auth(this.state.email, this.state.password)
				.then((auth: Auth) => {
					mem.auth = auth
					return window.Boost.token(auth.token || '')
				})
				.then((token: Token) => {
					mem.token = token
					if (mem.token && mem.auth && this.props.onSuccess) {
						this.props.onSuccess(mem.auth, mem.token)
					}
				})
				.catch(() => {})
				.then(() => {
					this.setState({ working: false })
				})
		}
	}

	handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		this.setState({ [event.target.name]: event.target.value } as any)
	}

	render() {
		return (
			<div className="login">
				<form onSubmit={this.handleLogin} className="form">
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
							<Link className="login-forgot" to="/reset-password">
								Forgotten password
							</Link>
						</div>
						<div className="login-links">
							<ServerContext.Consumer>
								{(server) =>
									server && server.config.allow_registrations ? (
										<Link className="login-link" to="/register">
											<IconNewUser /> Register
										</Link>
									) : (
										<span className="login-link" />
									)
								}
							</ServerContext.Consumer>

							<Button>
								<IconEnter /> Login
							</Button>
						</div>
					</fieldset>
				</form>
			</div>
		)
	}
}
