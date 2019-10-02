import { Link, navigate } from '@reach/router'
import cn from 'classnames'
import React from 'react'
import TeamSelect from '../components/TeamSelect'
import UserMedailon from '../components/UserMedailon'
import './sidebar.sass'
import { LayoutChildProps } from './Layout'
import { MeContext } from 'App'
import { Team } from 'connector/Model/Team'

interface SidebarProps extends LayoutChildProps {
	activeTeam?: string
	onChoice?: () => void
}

interface SidebarState {
	teams: null | Team[]
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
	state: SidebarState = {
		teams: null,
	}

	componentDidMount() {
		this.refreshTeams()
		window.addEventListener('teamsChanged', this.refreshTeams)
	}

	componentWillUnmount() {
		window.removeEventListener('teamsChanged', this.refreshTeams)
	}

	refreshTeams = () => {
		window.Einstore.teams().then((teams) => this.setState({ teams }))
	}

	handleChangeTeam = (team: string) => {
		if (team === 'all') {
			navigate(`/apps`)
		} else if (team === 'new') {
			navigate(`/team/new`)
		} else {
			navigate(`/apps/${team}`)
		}

		if (this.props.onChoice) {
			this.props.onChoice()
		}
	}

	render() {
		const { teams } = this.state
		const { activeTeam } = this.props
		return (
			<div className={cn('sidebar')}>
				<div className="sidebar-head">
					{teams && (
						<TeamSelect
							allowAll
							allowNew
							activeTeam={activeTeam || 'all'}
							teams={teams}
							onChangeTeam={this.handleChangeTeam}
						/>
					)}
				</div>
				<div className="sidebar-body">
					<div className="sidebar-menu">
						<Link
							onClick={this.props.onChoice}
							to={activeTeam ? `/apps/${activeTeam}` : '/apps'}
							className={cn('sidebar-menu-item')}
						>
							Dashboard
						</Link>
						<Link
							onClick={this.props.onChoice}
							to={activeTeam ? `/api-keys/${activeTeam}` : '/api-keys'}
							className={cn('sidebar-menu-item')}
						>
							API keys
						</Link>
						<Link
							onClick={this.props.onChoice}
							to={activeTeam ? `/team/${activeTeam}` : '/team'}
							className={cn('sidebar-menu-item')}
						>
							Team & members
						</Link>
					</div>
				</div>
				<div className="sidebar-foot">
					{window.Einstore && (
						<>
							<div className="sidebar-user">
								<Link onClick={this.props.onChoice} className="sidebar-user-avatar" to={'/me'}>
									<UserMedailon />
								</Link>
							</div>
							<div className="sidebar-addTeam">
								<Link onClick={this.props.onChoice} to="/me">
									My profile
								</Link>
								<MeContext.Consumer>
									{(me) =>
										me.isAdmin ? (
											<Link onClick={this.props.onChoice} to="/system">
												System settings
											</Link>
										) : null
									}
								</MeContext.Consumer>
								<Link to="/" onClick={window.logout}>
									Logout
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
		)
	}
}
