import React, { ChangeEvent, FormEvent } from 'react'
import { navigate } from '@reach/router'
import slugify from 'slugify'

import './systemSettings.sass'
import Button from '../components/button'
import TextInput from '../components/textInput'
//import previewFileImage from '../utils/previewFileImage'

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
						<TextInput
							type="text"
							name="name"
							value={this.state.name}
							onChange={this.handleChange}
							placeholder="Team name"
						/>
						<TextInput
							type="text"
							name="identifier"
							value={this.getIdentifier()}
							onChange={this.handleChange}
							placeholder="Identifier"
						/>
						<Button>Add team</Button>
					</form>
				</div>
			</div>
		)
	}
}
