import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AppIcon from '../components/AppIcon'
import CardListBuilds from '../components/cardListBuilds'
import IconBack from '../shapes/back'
import './apiBuilds.sass'
import './page.sass'
import IconAndroid from '../shapes/android'
import IconIos from '../shapes/ios'
import IconTrash from '../shapes/trash'
import usure from '../utils/usure'
import { navigate } from '@reach/router'

export default class AppBuilds extends Component {
	state = {
		loaded: false,
		name: '',
		icon: '',
		build: 0,
		version: '',
		builds: [],
	}

	componentDidMount() {
		window.Boost.clusterApps(this.props.appId)
			.then((result) => {
				console.log(result)
				this.setState({
					loaded: true,
					name: result[0].name,
					icon: result[0].icon,
					id: result[0].id,
					version: result[0].version,
					build: result[0].build,
					platform: result[0].platform,
					builds: result,
				})
			})
			.catch((err) => {
				console.error(err)
			})
	}

	getPlatformIcon() {
		switch (this.state.platform) {
			case 'ios':
				return <IconIos />
			case 'android':
				return <IconAndroid />
			default:
				return null
		}
	}

	handleDelete = () => {
		usure().then(() => {
			window.Boost.deleteCluster(this.props.appId).then(() => navigate('/apps'))
		})
	}

	render() {
		return (
			<div className="page">
				<div className="page-controls">
					<div className="page-control is-active" onClick={() => window.history.back()}>
						<IconBack /> Back
					</div>
				</div>
				<div className="card">
					<div className="card-header builds">
						<div className="builds-icon">
							<AppIcon empty={!this.state.icon} id={this.state.id} name={this.state.name} />
						</div>
						<div className="builds-name">
							{this.state.name} {this.getPlatformIcon()}
						</div>
						<div className="builds-id" style={{ fontFamily: 'Monaco, monospace' }}>
							{this.state.identifier}
						</div>
					</div>
					<div className="card-content">
						<CardListBuilds showAll={true} builds={this.state.builds} />
					</div>
				</div>
				<div
					style={{
						textAlign: 'right',
						padding: 20,
						maxWidth: 1200,
						margin: '0 auto',
						boxSizing: 'border-box',
					}}
				>
					<span className="api-action api-action-red" onClick={this.handleDelete}>
						<IconTrash /> Delete all builds
					</span>
				</div>
			</div>
		)
	}
}

AppBuilds.contextTypes = {
	connector: PropTypes.object,
	token: PropTypes.string,
}
