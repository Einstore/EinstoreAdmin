import React from 'react'
import { find } from 'lodash-es'

import Select from 'react-select'

import './teamSelect.sass'
import { TeamTag } from './TeamTag'

type Props = {
	allowAll: boolean
	allowNew: boolean
	teams: any[]
	activeTeam: any
	onChangeTeam: (id: any, name: string) => void
}

export default class TeamSelect extends React.Component<Props> {
	static defaultProps = {
		allowAll: false,
		allowNew: false,
	}

	handleChangeTeam = (val: any) => {
		this.props.onChangeTeam(val.team.id, val.team.name)
	}

	getOptions = () => {
		const options = this.props.allowAll
			? [{ name: 'All teams', id: 'all' }, ...this.props.teams]
			: this.props.teams

		if (this.props.allowNew) {
			options.push({ name: 'Add team', id: 'new' })
		}
		return options.map((team) => ({
			value: team.name,
			team,
			label: <TeamTag team={team} />,
		}))
	}

	render() {
		const options = this.getOptions()
		return (
			<div className="teamSelect">
				<Select
					placeholder="Select team"
					isSearchable={false}
					onChange={this.handleChangeTeam}
					value={find(options, (opt) => opt.team.id === this.props.activeTeam)}
					options={options}
				/>
			</div>
		)
	}
}
