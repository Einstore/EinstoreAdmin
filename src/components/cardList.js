import PropTypes from 'prop-types'
import React, { Component } from 'react'
import IconAndroid from '../shapes/android'
import IconIos from '../shapes/ios'
import './card.sass'
import CardItem from './cardItem'
import TeamName from './TeamName'
import { Link } from '@reach/router'

export default class CardList extends Component {
	state = {
		builds: null,
	}

	getBuildDate(dateTime) {
		let date = new Date(dateTime)
		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
	}

	getPlatformIcon() {
		switch (this.props.platform) {
			case 'ios':
				return <IconIos />
			case 'android':
				return <IconAndroid />
			default:
				return null
		}
	}

	componentDidMount() {
		window.Einstore.appBuilds(this.props.cluster_id, 3).then((builds) => this.setState({ builds }))
	}

	getBuilds() {
		return (
			this.state.builds || [{ placeholder: true }, { placeholder: true }, { placeholder: true }]
		)
	}

	render() {
		return (
			<div className="card">
				{(this.props.type || 'list') === 'list' ? (
					<Link className="card-header" to={'/app/' + this.props.cluster_id}>
						<div className="card-header-part">
							<div className="card-header-part-nameParts">
								<div>
									<div className="card-header-part-name">
										{this.props.name}
										<span className="card-header-part-name-icon">{this.getPlatformIcon()}</span>
									</div>
								</div>
								<div className="card-header-part-teamName">
									<TeamName key={this.props.teamId} teamId={this.props.teamId} />
								</div>
							</div>
						</div>
						<div className="card-header-part card-header-part-build">
							<div className="code">{this.props.id}</div>
						</div>
					</Link>
				) : (
					<div className="card-header">
						<div className="card-header-part">
							<div className="card-header-part-name">
								{this.props.name}
								<span className="card-header-part-name-icon">{this.getPlatformIcon()}</span>
							</div>
							<div className="card-header-part-id">({this.props.id})</div>
						</div>
						<div className="card-header-part" />
					</div>
				)}
				<div className="card-content">
					<div className="card-content-list">
						{this.getBuilds()
							.slice(0, 3)
							.map((item, key) => {
								return item.placeholder ? (
									<CardItem isAll={false} isLast={key === 0} key={key} placeholder />
								) : (
									<CardItem
										isAll={false}
										isLast={key === 0}
										key={key}
										link={'/build/' + item.id}
										icon={item.icon}
										name={item.name}
										appId={item.id}
										versionNumber={item.version}
										versionCode={item.build}
										date={this.getBuildDate(item.created)}
										build={item}
									/>
								)
							})}
					</div>
					<Link className="card-content-list-actions" to={'/app/' + this.props.cluster_id}>
						{this.props.buildCount > 3 ? (
							<span>
								Show all {this.props.buildCount} {this.props.buildCount === 1 ? 'build' : 'builds'}
							</span>
						) : (
							<span>Show app detail</span>
						)}
					</Link>
				</div>
			</div>
		)
	}
}

CardList.contextTypes = {
	connector: PropTypes.object,
	token: PropTypes.string,
}
