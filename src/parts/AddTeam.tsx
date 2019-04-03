import React, { ChangeEvent, FormEvent } from 'react'
import { navigate } from '@reach/router'

import './systemSettings.sass'
import Button from '../components/button'
import TextInput from '../components/textInput'
//import previewFileImage from '../utils/previewFileImage'

export default class AddTeam extends React.Component {
	state = {
		name: '',
		identifier: '',
	}
	handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		window.Einstore.addTeam(this.state.name, this.state.identifier).then((team: any) => {
			window.dispatchEvent(new Event('teamsChanged'))
			navigate(`/apps/${team.id}`)
		})
	}
	handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
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
							value={this.state.identifier}
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
