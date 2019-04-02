import { Link } from '@reach/router'
import React, { Component } from 'react'
import AppIcon from './AppIcon'
import './cardItem.sass'
import InstallButton, { InstallButtonView } from './InstallButton'

export default class CardItem extends Component {
	getBuildCountString() {
		const count = this.props.buildCount
		return `(${count} ${count === 1 ? 'build' : 'builds'})`
	}

	render() {
		if (this.props.isAll === false) {
			return (
				<div className="card-content-list-item-wrap">
					<Link to={this.props.link} className="card-content-list-item">
						<div className="card-content-list-item-image">
							<AppIcon empty={!this.props.icon} name={this.props.name} id={this.props.appId} />
						</div>
						<div className="card-content-list-item-text">
							<div className="card-content-list-item-text-version">
								{this.props.versionNumber}&nbsp;
								<span className="card-content-list-item-text-version-build">
									({this.props.versionCode})
								</span>
								{' '}
								{this.props.isLast === true ? (
									<span className="card-content-list-item-text-last">Latest</span>
								) : null}
							</div>
							<div className="card-content-list-item-text-date">{this.props.date}</div>
						</div>
						<div className="card-content-list-item-download">
							<InstallButton
								build={this.props.build}
								view={InstallButtonView.MINI}
								faded={this.props.isLast !== true}
							/>
						</div>
					</Link>
				</div>
			)
		} else {
			return (
				<div className="card-content-list-item-wrap">
					<Link to={this.props.link} className="card-content-list-item">
						<div className="card-content-list-item-all">
							<div className="card-content-list-item-all-big">Show all</div>
							<div className="card-content-list-item-all-small">{this.getBuildCountString()}</div>
						</div>
					</Link>
				</div>
			)
		}
	}
}
