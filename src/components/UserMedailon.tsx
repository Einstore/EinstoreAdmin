import CryptoJS from 'crypto-js'
import React from 'react'

import { MeContext } from '../App'

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
								<img alt="" src={`https://www.gravatar.com/avatar/${CryptoJS.MD5(me.email)}.jpg`} />
							</div>
							<div className="menu-user-name">{me.firstname + ' ' + me.lastname}</div>
						</div>
					)
				}
			</MeContext.Consumer>
		)
	}
}
