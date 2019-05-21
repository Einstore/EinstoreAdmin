import React from 'react'
import allTeamsIcon from '../ui/Icons/all-teams.svg'
import addTeamIcon from '../ui/Icons/add-team.svg'
import AppIcon from './AppIcon'
import './teamIcon.sass'
import Squircle from 'ui/Squircle'

export const TeamIcon = ({ team, iconSize }: { team: any; iconSize?: number }) => {
	let icon = <Squircle color={'#eee'} />

	if (team) {
		if (team.id === 'new') {
			icon = <Squircle color={'#236aea'} src={addTeamIcon} />
		} else if (team.id === 'all') {
			icon = <Squircle color={'#0AB'} src={allTeamsIcon} />
		} else if (team.icon) {
			icon = <AppIcon
				context="teams"
				id={team.id}
				name={team.initials}
			/>
		} else {
			icon = <Squircle color={team.color} placeholder={team.initials} />
		}
	} else {
		icon = <Squircle color={'#eee'} />
	}

	return (
		<span className="teamTag-img" style={{ fontSize: iconSize }}>
			{icon}
		</span>
	)

}

export const TeamTag = ({
	team,
	iconSize,
	withoutName,
}: {
	team: any
	iconSize?: number
	withoutName?: boolean
}) => {
	return (
		<div className="teamTag">
			<TeamIcon team={team} iconSize={iconSize} />
			{!withoutName && <span className="teamTag-label">{team && team.name}</span>}
		</div>
	)
}
