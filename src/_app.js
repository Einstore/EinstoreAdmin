import CryptoJS from 'crypto-js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter, NavLink } from 'react-router-dom'
import IconRekola from './apiData/rekola.jpg'
import './app.sass'
import Header from './components/header'
import TeamItem from './components/teamItem'
import TeamSelect from './components/TeamSelect'
import { Einstore } from './connector/Einstore.ts'
import { Config } from './connector/Config.ts'
import Account from './parts/account'
import Api from './parts/api'
import AppBuilds from './parts/appBuilds'
import AppDetail from './parts/appDetail'
// parts for router
import Login from './parts/login'
import Overview from './parts/overview'
import Register from './parts/register'
import ResetPassword from './parts/ResetPassword'
import './parts/switch.sass'
import Team from './parts/team'
import IconTimes from './shapes/times'

class UserMedailon extends Component {
	state = {
		loading: false,
		hash: null,
		name: null,
	}

	componentDidMount() {
		this.props.connector.me().then((user) => {
			this.setState({
				hash: CryptoJS.MD5(user.email),
				name: user.firstname + ' ' + user.lastname,
			})
		})
	}

	render() {
		return (
			<div>
				{this.state.hash && (
					<div>
						<div className="menu-user-icon">
							<img alt="" src={`https://www.gravatar.com/avatar/${this.state.hash}.jpg`} />
						</div>
						<div className="menu-user-name">{this.state.name}</div>
					</div>
				)}
			</div>
		)
	}
}

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			token: localStorage.getItem('token'),
			authToken: localStorage.getItem('authToken'),
			route: window.location.pathname,
			menuIsVisible: false,
			icons: {},
			name: 'Einstore',
			teamName: null,
			switchIsVisible: false,
			filteringIsVisible: false,
			teams: [],
			team: '',
			buttonType: 'addBuild',
			user: null,
		}

		this.config = new Config()
		this.config.onLoggedOut = this.onLoggedOut

		const el = document.getElementById('shortcut-icon')
		if (el) {
			el.setAttribute('href', `${this.config.url}/server/favicon/`)
		}

		this.connector = new Einstore(this.config, this.state.token)
		window.einstoreApp = this.connector
		window.rootApp = this

		this.changeRoute = this.changeRoute.bind(this)
		this.setToken = this.setToken.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.hideMenu = this.hideMenu.bind(this)
		this.toggleSwitch = this.toggleSwitch.bind(this)
		this.selectTeam = this.selectTeam.bind(this)
	}

	logout = () => {
		this.setToken('')
		window.location.href = '/login'
	}

	onLoggedOut = (code) => {
		this.setToken('')
		if (code === 401) {
			window.location.href = '/login?returnUrl=' + encodeURIComponent(window.location.href)
		} else {
			window.location.href = '/login'
		}
	}

	componentDidMount() {
		this.connector
			.server()
			.then((result) => {
				if (typeof result.error !== 'undefined') {
					throw new Error()
				}
				document.title = result.name

				let icons = {}
				const head = document.querySelector('head')
				result.icons.forEach((item) => {
					icons[item.size] = item.url
					let link = document.createElement('link')
					link.rel = 'icon'
					link.href = item.url
					link.size = `${item.size}x${item.size}`
					link.type = 'image/png'
					head.appendChild(link)
					// <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
				})
				this.setState({
					name: result.name,
					icons: icons,
				})
				if (this.state.token !== '') {
					this.connector
						.teams()
						.then((result) => {
							console.log(result)
							this.setState({
								teams: result,
								team: result[0].id,
								teamName: result[0].name,
							})
							document.title = this.state.name + ' – ' + this.state.teamName
						})
						.catch((error) => {
							console.error(error)
						})
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}

	changeRoute() {
		this.setState({
			route: window.location.pathname,
		})
		let part = this.state.route.replace('/', '')
		part = part.replace('/.+', '')
		console.log(part)
		switch (part) {
			case 'overview':
				this.switchButton('addBuild')
				break
			default:
				this.switchButton('none')
				break
		}
		console.log(this.state.route)
	}

	setToken(token) {
		localStorage.setItem('token', token)
		this.setState({
			token: token,
		})
		this.connector
			.teams()
			.then((result) => {
				console.log(result)
				this.setState({
					teams: result,
					team: result[0].id,
					teamName: result[0].name,
				})
				document.title = this.state.name + ' – ' + this.state.teamName
			})
			.catch((error) => {
				console.error(error)
			})
	}

	setAuthToken(token) {
		localStorage.setItem('authToken', token)
		this.setToken({
			authToken: token,
		})
	}

	getChildContext() {
		return {
			config: this.config,
			connector: this.connector,
			token: this.state.token || '',
			authToken: this.state.authToken || '',
			setToken: this.setToken || function() {},
			setAuthToken: this.setAuthToken || function() {},
			setApiKeyCallback: this.setApiKeyCallback || function() {},
			apiKeyCallback: this.state.apiKeyCallback || function() {},
			name: this.state.name,
			icons: this.state.icons,
			team: this.state.team,
		}
	}

	hideMenu() {
		if (this.state.menuIsVisible !== false) {
			this.setState({
				menuIsVisible: false,
			})
		}
	}

	toggleMenu() {
		this.setState({
			menuIsVisible: !this.state.menuIsVisible,
		})
	}

	toggleSwitch() {
		this.setState({
			switchIsVisible: !this.state.switchIsVisible,
		})
	}

	toggleFiltering = () => {
		this.setState({
			filteringIsVisible: !this.state.filteringIsVisible,
		})
	}

	switchButton = (type) => {
		this.setState({
			buttonType: type,
		})
	}

	selectTeam = (id, name) => {
		this.setState(
			{
				team: id,
				teamName: name,
				switchIsVisible: false,
				menuIsVisible: false,
			},
			() => {
				document.title = this.state.name + ' – ' + this.state.teamName
			}
		)
	}

	setApiKeyCallback = (fun) => {
		this.setState({
			apiKeyCallback: fun,
		})
	}

	render() {
		return (
			<BrowserRouter>
				<div
					className={
						'outer' +
						(this.state.menuIsVisible ? ' is-menu' : '') +
						(this.state.filteringIsVisible ? ' has-filtering' : '')
					}
				>
					<div className="menu">
						<div className="menu-team-switcher">
							<TeamSelect
								allowAll
								teams={this.state.teams}
								activeTeam={this.state.team}
								onChangeTeam={this.selectTeam}
							/>
						</div>
						<ul className="menu-links">
							<li className="menu-link" onClick={this.toggleMenu}>
								<NavLink
									exact
									activeClassName="is-active"
									className="menu-link-href"
									to={'/'}
									onClick={() => {
										this.switchButton('addBuild')
									}}
								>
									Apps
								</NavLink>
							</li>
							<li className="menu-link" onClick={this.toggleMenu}>
								<NavLink
									exact
									activeClassName="is-active"
									className="menu-link-href"
									to={'/api-keys'}
									onClick={() => {
										this.switchButton('addApiKey')
									}}
								>
									API keys
								</NavLink>
							</li>
							<li className="menu-link" onClick={this.toggleMenu}>
								<NavLink
									exact
									activeClassName="is-active"
									className="menu-link-href"
									to={'/team'}
									onClick={() => {
										this.changeRoute('addTeam')
									}}
								>
									Team
								</NavLink>
							</li>
						</ul>
						<div className="menu-switch">
							<div className="menu-user" onClick={this.toggleMenu}>
								<NavLink
									exact
									className="menu-link-href"
									to={'/account'}
									onClick={() => {
										this.switchButton('none')
									}}
								>
									{this.state.token && <UserMedailon connector={this.connector} />}
								</NavLink>
							</div>
							<span onClick={this.logout}>Logout</span>
						</div>
					</div>
					<div onClick={this.hideMenu} className="inner">
						<Switch>
							<Route path="/login" exact component={null} />
							<Route path="/register" exact component={null} />
							<Route
								path="/"
								render={(props) => (
									<Header
										key={'header' + this.state.team}
										{...props}
										icon={this.state.icons}
										isMoved={this.state.menuIsVisible}
										filteringIsVisible={this.state.filteringIsVisible}
										toggleFiltering={this.toggleFiltering}
										toggleMenu={this.toggleMenu}
										buttonType={this.state.buttonType}
										onLoggedOut={this.onLoggedOut}
									/>
								)}
							/>
						</Switch>
						<div className="app">
							<Route
								path="/login"
								render={(props) => <Login {...props} icon={this.state.icons} />}
								onEnter={this.changeRoute}
							/>
							<Route
								key={'register' + this.state.team}
								path="/register"
								render={(props) => <Register {...props} icon={this.state.icons} />}
								onEnter={this.changeRoute}
							/>
							<Route
								key={'reset-password' + this.state.team}
								path="/reset-password"
								render={(props) => <ResetPassword {...props} icon={this.state.icons} />}
								onEnter={this.changeRoute}
							/>
							<Route
								exact
								key={'team' + this.state.team}
								path="/team"
								component={Team}
								onEnter={this.changeRoute}
							/>
							<Route
								exact
								key={'account' + this.state.team}
								path="/account"
								component={Account}
								onEnter={this.changeRoute}
							/>
							<Route
								exact
								key={'apikeys' + this.state.team}
								path="/api-keys"
								component={Api}
								onEnter={this.changeRoute}
							/>
							<Route
								exact
								key={'root' + this.state.team}
								path="/"
								component={Overview}
								onEnter={this.changeRoute}
							/>
							<Route
								exact
								key={'detail' + this.state.team}
								path="/app/:appId/:platform/build/:buildId"
								component={AppDetail}
								onEnter={this.changeRoute}
							/>
							<Route
								exact
								path="/app/:appId/:platform"
								key={'builds' + this.state.team}
								component={AppBuilds}
								onEnter={this.changeRoute}
							/>
						</div>
					</div>
					{this.state.switchIsVisible ? (
						<div className="switch">
							<div className="switch-close" onClick={this.toggleSwitch} />
							<div className="switch-inner">
								<div className="switch-header">
									<div className="switch-header-close" onClick={this.toggleSwitch}>
										<IconTimes />
									</div>
									<div className="switch-header-title">Switch team</div>
								</div>
								{this.state.teams.map((item) => (
									<TeamItem
										key={item.id}
										id={item.id}
										active={this.state.team === item.id ? true : false}
										select={this.selectTeam}
										icon={IconRekola}
										name={item.name}
									/>
								))}
								<div className="switch-footer">
									<div className="switch-footer-button">+ Add new team</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</BrowserRouter>
		)
	}
}

App.childContextTypes = {
	config: PropTypes.object,
	connector: PropTypes.object,
	token: PropTypes.string,
	authToken: PropTypes.string,
	setToken: PropTypes.func,
	setAuthToken: PropTypes.func,
	name: PropTypes.string,
	icons: PropTypes.object,
	team: PropTypes.string,
	setApiKeyCallback: PropTypes.func,
	apiKeyCallback: PropTypes.func,
}

export default App
