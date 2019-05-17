import React from 'react'
import allTeamsIcon from '../shapes/all-teams.png'
import AppIcon from './AppIcon'
import './teamIcon.sass'
import getContrastColor from '../utils/getContrastColor'

export const TeamIcon = ({ team, iconSize }: { team: any; iconSize?: number }) => {
	if (!team) {
		return (
			<span className="teamTag-img" style={{ fontSize: iconSize }}>
				<div
					className="teamIcon"
					style={{ backgroundColor: `#eee`, color: `${getContrastColor('eee')}` }}
				>
					<div className="teamIcon-initials"></div>
				</div>
			</span>
		)
	}

	if (team.id === 'new') {
		return (
			<span className="teamTag-img" style={{ fontSize: iconSize }}>
				<div className="teamIcon view-add">
					<div className="teamIcon-initials">+</div>
				</div>
			</span>
		)
	}

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
		<AppIcon
			iconSize={iconSize}
			context="teams"
			id={team.id}
			className="teamTag-img"
			name={team.initials}
		/>
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
