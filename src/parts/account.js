import React, { Component } from 'react'
import Button from '../components/button'
import Gravatar from '../components/Gravatar'
import './account.sass'
import './page.sass'
import showMessage from "../utils/showMessage";
import pageTitle from "../utils/pageTitle";

export default class Account extends Component {
	state = {
		working: false,
		old: null,
		form: {},
	}

	componentDidMount() {
		window.Einstore.me().then((me) => {
			this.setState({ old: me, form: { ...me } })
		})
		pageTitle('My profile')
	}

	getFormValues = () => {
		const update = {
			firstname: this.state.form.firstname,
			lastname: this.state.form.lastname,
		}

		if (this.state.form.password) {
			update.password = this.state.form.password

			if (this.state.form.password !== this.state.form.passwordagain) {
				showMessage('Passwords do not match')
				return false
			}
		}

		return update
	}

	handleSubmit = (e) => {
		e.preventDefault()

		const values = this.getFormValues()

		if (values) {
			this.setState({ working: true })
			window.Einstore.updateUser(this.state.old.id, values)
				.catch()
				.then(() => {
					this.setState({ working: false })
					// Force refreshing identity through the app
					window.location.reload()
				})
		}
	}

	handler = (name) => {
		return {
			value: this.state.form[name] || '',
			onChange: (e) => {
				const value = e.target.value
				this.setState((state) => ({ ...state, form: { ...state.form, [name]: value } }))
			},
		}
	}

	render() {
		const { old, form } = this.state

		return (
			<div className="sheet">
				<div className="sheet-main">
					<h2 className="sheet-title">My profile</h2>
				<div className="systemSettingsForm view-image">
					<div className="systemSettingsForm-current">
						<div className="IconField">
							<div className="IconField-in">
								<div className="IconField-image view-old">
									{old && <Gravatar email={old.email} />}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="account-form">
					<form onSubmit={this.handleSubmit}>
						<fieldset disabled={this.state.working}>
							<label className="account-form-item">
								<span className="account-form-item-label">First name:</span>
								<input
									type="text"
									name="firstname"
									className="account-form-item-input"
									{...this.handler('firstname')}
								/>
							</label>
							<label className="account-form-item">
								<span className="account-form-item-label">Last name:</span>
								<input
									type="text"
									name="lastname"
									className="account-form-item-input"
									{...this.handler('lastname')}
								/>
							</label>
							<label className="account-form-item">
								<span className="account-form-item-label">Email:</span>
								<input
									type="email"
									name="email"
									className="account-form-item-input"
									readOnly={true}
									value={(old && old.email) || ''}
								/>
							</label>
							<label className="account-form-item">
								<span className="account-form-item-label">New password:</span>
								<input
									type="password"
									name="password"
									className="account-form-item-input"
									{...this.handler('password')}
								/>
							</label>
							<label className="account-form-item">
								<span className="account-form-item-label">Repeat password:</span>
								<input
									type="password"
									name="passwordagain"
									className="account-form-item-input"
									{...this.handler('passwordagain')}
								/>
							</label>
							<Button className="account-form-submit">Save changes</Button>
						</fieldset>
					</form>
				</div>
				</div>
			</div>
		)
	}
}
