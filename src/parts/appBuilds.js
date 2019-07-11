import PropTypes from 'prop-types'
import React, { Component } from 'react'
import AppIcon from '../components/AppIcon'
import LoadMore from '../ui/LoadMore'
import IconBack from '../shapes/back'
import './apiBuilds.sass'
import './page.sass'
import PlatformIcon from 'ui/PlatformIcon'
import IconTrash from '../shapes/trash'
import usure from '../utils/usure'
import { navigate } from '@reach/router'
import CardItem from '../components/cardItem'

export default class AppBuilds extends Component {
	state = {
		build: {},
	}

	componentDidMount() {
		window.Einstore.appBuilds(this.props.appId).then((result) => {
			this.setState({
				build: result[0],
			})
		})
	}

	loadPage = (page) => {
		const perPage = 10
		const offset = perPage * (page - 1)

		return window.Einstore.appBuilds(this.props.appId, perPage, offset)
	}

	handleDelete = () => {
		usure().then(() => {
			window.Einstore.deleteApp(this.props.appId).then(() => navigate('/apps'))
		})
	}

	getBuildDate(dateTime) {
		let date = new Date(dateTime)
		return date
	}

	renderBuild = (item) => {
		return (
			<CardItem
				isAll={false}
				link={'/build/' + item.id}
				icon={item.icon}
				platform={item.platform}
				versionNumber={item.version}
				versionCode={item.build}
				appId={item.id}
				date={this.getBuildDate(item.created)}
				build={item}
			/>
		)
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
							<AppIcon
								empty={!this.state.build.icon}
								id={this.state.build.id}
								name={this.state.build.name}
								platform={this.state.build.platform}
							/>
						</div>
						<div className="builds-name">
							{this.state.build.name} <PlatformIcon platform={this.state.build.platform} />
						</div>
						<div className="builds-id" style={{ fontFamily: 'Monaco, monospace' }}>
							{this.state.build.identifier}
						</div>
					</div>
					<div className="card-content">
						<LoadMore
							itemsClassName="card-content-list"
							loadPage={this.loadPage}
							renderItem={this.renderBuild}
						/>
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
