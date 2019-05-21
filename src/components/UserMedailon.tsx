import React from 'react'
import { MeContext } from '../App'
import Gravatar from './Gravatar'

interface UserMedailonProps {}

interface UserMedailonState {}

export default class UserMedailon extends React.PureComponent<
	UserMedailonProps,
	UserMedailonState
> {
	render() {
		return (
			<MeContext.Consumer>
				{(me) =>
					me && (
						<div>
							<div className="menu-user-icon">
								<Gravatar email={me.email} />
							</div>
							<div className="menu-user-name">{me.firstname + ' ' + me.lastname}</div>
						</div>
					)
				}
			</MeContext.Consumer>
		)
	}
}
