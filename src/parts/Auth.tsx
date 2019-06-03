import { Link, RouteComponentProps, navigate } from '@reach/router'
import cn from 'classnames'
import React, { ChangeEvent, FormEvent } from 'react'
import Button from '../components/button'
import Login from '../components/Login'
import TextInput from '../components/textInput'
import { Auth } from '../connector/Model/Auth'
import { Token } from '../connector/Model/Token'
import { ServerIcon } from '../components/ServerIcon'
import IconEnter from '../shapes/enter'
import { ServerContext } from '../App'
import { parse } from 'query-string'
import jwtDecode from 'jwt-decode'
import IconNewUser from '../shapes/newUser'
import Form, { exportValidationSchema, FormControl, ValuesObject } from 'ui/Form'
import * as Yup from 'yup'

export enum AuthView {
	RESET_PASSWORD = 'reset-password',
	SET_PASSWORD = 'set-password',
	REGISTRATION = 'register',
	LOGIN = 'login',
	OAUTH_RESULT = 'outh-result',
}

export interface AuthRouteProps {
	view: AuthView
	onLogin: (auth: Auth, token: Token) => void
	onRegister: (email: string) => void
	onResetPassword: (email: string) => void
}

interface AuthComponentProps {
	onSuccess?: (email: string) => void
}

class Registration extends React.Component<AuthComponentProps> {
	state = {
		working: false,
		email: '',
		username: '',
		lastname: '',
		firstname: '',
		password: '',
	}

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		const { email, username, lastname, firstname, password } = this.state
		if (email && username && lastname && firstname && password)
			window.Einstore.register({
				email,
				username,
				lastname,
				firstname,
				password,
			}).then((res) => {
				if (res && res.error) {
					alert(res.description)
					console.error(res)
				} else {
					alert('Your registration went OK. Check your email.')
				}
			})
	}

	handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		this.setState({ [event.target.name]: event.target.value } as any)
	}

	render() {
		return (
			<div className="login">
				<ServerContext.Consumer>
					{(server) => (
						<form onSubmit={this.handleSubmit} className="form">
							<fieldset disabled={this.state.working}>
								<div className="form-icon">
									<ServerIcon />
								</div>
								{server &&
									server.config.allowed_registration_domains &&
									!!server.config.allowed_registration_domains.length && (
										<div className="login-allowedDomains">
											<h4 className="login-allowedDomains">Allowed email domains:</h4>
											<ul>
												{server.config.allowed_registration_domains.map((domain: string) => (
													<li key={domain}>@{domain}</li>
												))}
											</ul>
										</div>
									)}

								<div>
									<TextInput
										name="email"
										type="email"
										placeholder="E-mail"
										value={this.state.email}
										onChange={this.handleChange}
									/>
								</div>

								<div>
									<TextInput
										name="username"
										type="text"
										placeholder="Username"
										value={this.state.username}
										onChange={this.handleChange}
									/>
								</div>

								<div>
									<TextInput
										name="firstname"
										type="text"
										placeholder="First name"
										value={this.state.firstname}
										onChange={this.handleChange}
									/>
								</div>

								<div>
									<TextInput
										name="lastname"
										type="text"
										placeholder="Last name"
										value={this.state.lastname}
										onChange={this.handleChange}
									/>
								</div>

								<div>
									<TextInput
										name="password"
										type="password"
										placeholder="Password"
										value={this.state.password}
										onChange={this.handleChange}
									/>
								</div>
								<div className="login-links">
									<div className="login-links-left">
										<Link className="login-link" to="/">
											<IconEnter /> Login
										</Link>
										<Link className="login-link" to="/reset-password">
											Reset password
										</Link>
									</div>
									<Button>
										<IconNewUser /> Register
									</Button>
								</div>
							</fieldset>
						</form>
					)}
				</ServerContext.Consumer>
			</div>
		)
	}
}

class ResetPassword extends React.Component<AuthComponentProps> {
	state = {
		working: false,
		email: '',
	}

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (this.state.email) {
			window.Einstore.resetPassword(this.state.email).then((res: any) => {
				if (res && res.error) {
					alert(res.description)
					console.error(res)
				} else {
					if (this.props.onSuccess) {
						alert('Your password has been reset. Check your email for further instructions.')
						this.props.onSuccess(this.state.email)
					}
				}
			})
		}
	}

	handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		this.setState({ [event.target.name]: event.target.value } as any)
	}

	render() {
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="form">
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
						<div className="login-links">
							<div className="login-links-left">
								<Link className="login-link" to="/">
									<IconEnter />
									Login
								</Link>

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
							</div>
							<Button>Reset password</Button>
						</div>
					</fieldset>
				</form>
			</div>
		)
	}
}

const setPasswordControls: FormControl[] = [
	{ name: 'new_password', type: 'password', required: true, label: 'New password' },
	{
		name: 'new_password_check',
		label: 'Confirm password',
		type: 'password',
		required: true,
		rules: Yup.string().oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
	},
]

const setPasswordValidationSchema = exportValidationSchema(setPasswordControls)

function SetPassword() {
	const [working, setIsWorking] = React.useState(false)

	const handleSubmit = React.useCallback((values: ValuesObject) => {
		const token = parse(window.location.search).token as string

		if (!token) {
			alert('Cannot update password without token.')
		}

		setIsWorking(true)

		window.Einstore.checkPassword(values.new_password).then((ok) => {
			if (!ok) {
				alert('Password is not strong enough. Please choose a better one.')
				setIsWorking(false)
				return
			}
			window.Einstore.updateResetPassword(token, values.new_password).then((status: any) => {
				alert('Your password has been changed.')
				navigate('/')
				setIsWorking(false)
			})
		})
	}, [])

	return (
		<div className="login">
			<Form
				submitLabel="Update password"
				isWorking={working}
				controls={setPasswordControls}
				validationSchema={setPasswordValidationSchema}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}

export class AuthRoute extends React.Component<RouteComponentProps<AuthRouteProps>> {
	lastInfo: string = ''

	render() {
		switch (this.props.view) {
			case AuthView.LOGIN:
				return (
					<div className={cn('auth', 'view-' + this.props.view)}>
						<Login onSuccess={this.props.onLogin} />
					</div>
				)
			case AuthView.REGISTRATION:
				return (
					<div className={cn('auth', 'view-' + this.props.view)}>
						<Registration onSuccess={this.props.onRegister} />
					</div>
				)
			case AuthView.RESET_PASSWORD:
				return (
					<div className={cn('auth', 'view-' + this.props.view)}>
						<ResetPassword onSuccess={this.props.onResetPassword} />
					</div>
				)
			case AuthView.SET_PASSWORD:
				return (
					<div className={cn('auth', 'view-' + this.props.view)}>
						<SetPassword />
					</div>
				)
			case AuthView.OAUTH_RESULT:
				const info = parse(window.location.search).info as string
				if (this.lastInfo !== info) {
					this.lastInfo = info
					window.Einstore.token(jwtDecode(info).token).then(() => {
						window.location.href = '/'
					})
				}
				return <div className={cn('auth', 'view-' + this.props.view)} />
			default:
				return null
		}
	}
}
