import bestContrast from 'get-best-contrast-color'
import React from 'react'
import allTeamsIcon from '../shapes/all-teams.png'
import AppIcon from './AppIcon'
import './teamIcon.sass'

const colors = ['#000', '#FFF']

const getContrastColor = (original: string) => bestContrast(`#${original}`, colors)

export const TeamIcon = ({ team, iconSize }: { team: any; iconSize?: number }) => {

	if (team.id === 'all') {
		return (
			<span className="teamTag-img" style={{ fontSize: iconSize }}>
				<div className="teamIcon" style={{ backgroundColor: `#${'0AB'}` }}>
					<div
						className="teamIcon-initials"
						style={{ backgroundImage: `url('${allTeamsIcon}')` }}
					/>
				</div>
			</span>
		)
	}
	return team.icon ? (
		<AppIcon iconSize={iconSize} context="teams" id={team.id} className="teamTag-img" name={team.initials} />
	) : (
		<span className="teamTag-img" style={{ fontSize: iconSize }}>
			<div
				className="teamIcon"
				style={{ backgroundColor: `#${team.color}`, color: `${getContrastColor(team.color)}` }}
			>
				<div className="teamIcon-initials">{team.initials}</div>
			</div>
		</span>
	)
}

export const TeamTag = ({ team, iconSize }: { team: any; iconSize?: number }) => {
	return (
		<div className="teamTag">
			<TeamIcon team={team} iconSize={iconSize} />
			<span className="teamTag-label">{team.name}</span>
		</div>
	)
}
