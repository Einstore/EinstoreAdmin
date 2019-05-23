import React, { ChangeEvent, FormEvent } from 'react'
import { navigate } from '@reach/router'
import slugify from 'slugify'
import './systemSettings.sass'
import Button from '../components/button'
import TextInput from '../components/textInput'

class TeamIdentifierAvailabilityChecker extends React.PureComponent<{ identifier: string }> {
	mounted = false

	state = {
		available: null,
	}

	componentDidMount() {
		this.mounted = true

		if (this.props.identifier && this.props.identifier.trim()) {
			window.Einstore.checkTeamIdentifierAvailability(this.props.identifier.trim()).then(
				(status) => {
					if (this.mounted) {
						this.setState({ available: status })
					}
				}
			)
		}
	}

	componentWillUnmount() {
		this.mounted = false
	}

	render() {
		if (!this.props.identifier || !this.props.identifier.trim()) {
			return null
		}
		const { available } = this.state
		if (available === null) {
			return <div className={`TeamIdentifierAvailabilityChecker`}>checking</div>
		}
		return (
			<div
				className={`TeamIdentifierAvailabilityChecker view-${
					available === true ? 'available' : 'unavailable'
				}`}
			>
				{available === true ? 'ok' : 'not available'}
			</div>
		)
	}
}

export default class AddTeam extends React.Component {
	state = {
		name: '',
		identifier: '',
		customIdentifier: false,
	}

	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (!this.state.name.trim()) {
			alert('Please fill in a team name.')
			return
		}

		if (!this.getIdentifier().trim()) {
			alert('Please fill in a team identifier.')
			return
		}

		window.Einstore.addTeam(this.state.name, this.getIdentifier())
			.then((team: any) => {
				window.dispatchEvent(new Event('teamsChanged'))
				navigate(`/apps/${team.id}`)
			})
			.catch((err) => {
				alert(err.message)
			})
	}

	handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const state: any = { [e.currentTarget.name]: e.currentTarget.value }
		if (e.currentTarget.name === 'identifier') {
			state.customIdentifier = true
		}

		this.setState(state)
	}

	getIdentifier = () => {
		return this.state.customIdentifier ? this.state.identifier : slugify(this.state.name)
	}

	render() {
		return (
			<div className="sheet">
				<div className="sheet-main">
					<h2 className="sheet-title">Add new team</h2>
					<form action="" onSubmit={this.handleSubmit}>
						<div className="sheet-form-control">
							<TextInput
								type="text"
								name="name"
								value={this.state.name}
								onChange={this.handleChange}
								placeholder="Team name"
							/>
						</div>
						<div className="sheet-form-control">
							<TextInput
								type="text"
								name="identifier"
								value={this.getIdentifier()}
								onChange={this.handleChange}
								placeholder="Identifier"
							/>
							<div className="sheet-form-control-indicator">
								<TeamIdentifierAvailabilityChecker
									key={this.getIdentifier()}
									identifier={this.getIdentifier()}
								/>
							</div>
						</div>
						<Button>Add team</Button>
					</form>
				</div>
			</div>
		)
	}
}
