import cn from 'classnames'
import React from 'react'
import './teamName.sass'
import { TeamTag } from './TeamTag';
import { Team } from '../connector/Model/Team';

interface TeamNameProps {
	teamId: string
	className?: string
	iconSize?: number
}

interface TeamNameState {
	team?: Team
}

export default class TeamName extends React.PureComponent<TeamNameProps, TeamNameState> {
	state = {
		team: undefined
	}

	componentDidMount() {
		window.Boost.team(this.props.teamId).then((data: any) => this.setState({ team: data }))
	}

	render() {
		return (
			<div className={cn('teamName', this.props.className)}>
				{this.state.team && <TeamTag team={this.state.team} iconSize={this.props.iconSize} />}
			</div>
		)
	}
}
