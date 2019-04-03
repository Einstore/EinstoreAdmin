import { Link, navigate } from '@reach/router'
import cn from 'classnames'
import React from 'react'
import TeamSelect from '../components/TeamSelect'
import UserMedailon from '../components/UserMedailon'
import './sidebar.sass'
import { LayoutChildProps } from './Layout'

interface SidebarProps extends LayoutChildProps {
	activeTeam?: string
	onChoice?: () => void
}

export class Sidebar extends React.Component<SidebarProps> {
	state = {
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
		} else {
			navigate(`/apps/${team}`)
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
							className="sidebar-menu-item"
						>
							API keys
						</Link>
						<Link
							onClick={this.props.onChoice}
							to={activeTeam ? `/team/${activeTeam}` : '/'}
							className={cn('sidebar-menu-item', !activeTeam && 'is-inactive')}
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
								<Link onClick={this.props.onChoice} to="/me">My profile</Link>
								<Link onClick={this.props.onChoice} to="/team/new">Create a new team</Link>
								<Link to="/" onClick={window.logout}>Logout</Link>
							</div>
						</>
					)}
				</div>
			</div>
		)
	}
}
