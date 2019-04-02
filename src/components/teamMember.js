import React, { Component } from 'react'
import IconTrash from '../shapes/trash'
import Gravatar from './Gravatar'
import usure from '../utils/usure'

export default class TeamMember extends Component {
	removeFromTeam = (e) => {
		e.preventDefault()
		usure().then(() => {
			window.Boost.removeUserFromTeam(this.props.teamId, this.props.id).then(() => {
				window.location.reload()
			})
		})
	}

	render() {
		return (
			<div className="card-content-member">
				<div className="card-content-member-info">
					<div className="card-content-member-info-photo">
						<Gravatar email={this.props.email} />
					</div>
					<div className="card-content-member-info-text">
						<div className="card-content-member-info-text-name">
							{this.props.firstname} {this.props.lastname}
						</div>
						<div className="card-content-member-info-text-contact">
							{this.props.username} • {this.props.email}
						</div>
					</div>
				</div>
				<div className="card-content-member-action" onClick={this.removeFromTeam}>
					<IconTrash /> Remove from team
				</div>
			</div>
		)
	}
}
