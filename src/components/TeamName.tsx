import cn from 'classnames'
import React from 'react'
import './teamName.sass'
import { TeamTag } from './TeamTag'
import { Team } from '../connector/Model/Team'

interface TeamNameProps {
	teamId: string
	className?: string
	iconSize?: number
	withoutName: boolean
}

interface TeamNameState {
	team?: Team
}

export default class TeamName extends React.PureComponent<TeamNameProps, TeamNameState> {
	static defaultProps = {
		withoutName: false,
	}

	state = {
		team: undefined,
	}

	componentDidMount() {
		if (this.props.teamId) {
			window.Einstore.team(this.props.teamId).then((data: any) => this.setState({ team: data }))
		}
	}

	render() {
		return (
			<div className={cn('teamName', this.props.className)}>
				<TeamTag
					team={this.state.team}
					withoutName={this.props.withoutName}
					iconSize={this.props.iconSize}
				/>
			</div>
		)
	}
}
