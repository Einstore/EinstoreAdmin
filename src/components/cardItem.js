import { Link } from '@reach/router'
import React, { Component } from 'react'
import AppIcon from './AppIcon'
import './cardItem.sass'
import InstallButton, { InstallButtonView } from './InstallButton'
import prettyDate from "../utils/prettyDate";

const placeholderProps = {
	name: null,
	icon: false,
	appId: null,
	versionCode: null,
	date: null,
	buildCount: 'x',
	link: '/',
	isLast: false,
	build: { platform: 'android' },
	platform: 'android',
}

export default class CardItem extends Component {
	getBuildCountString(count) {
		return `(${count} ${count === 1 ? 'build' : 'builds'})`
	}

	render() {
		const {
			name,
			icon,
			appId,
			versionCode,
			versionNumber,
			date,
			build,
			buildCount,
			link,
			isLast,
		} = this.props.placeholder ? placeholderProps : this.props

		const platform = this.props.platform


		const timeBuiltOption = {
			hour: 'numeric',
			minute: 'numeric',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		}

		if (this.props.isAll === false) {
			return (
				<div className="card-content-list-item-wrap">
					<Link to={link} className="card-content-list-item">
						<div className="card-content-list-item-image">
							<AppIcon empty={!icon} name={name} id={appId} platform={platform} />
						</div>
						<div className="card-content-list-item-text">
							<div className="card-content-list-item-text-version">
								{versionNumber}&nbsp;
								{versionCode && (
									<span className="card-content-list-item-text-version-build">({versionCode})</span>
								)}{' '}
								{isLast === true ? (
									<span className="card-content-list-item-text-last">Latest</span>
								) : null}
							</div>
							<div className="card-content-list-item-text-date">{date && prettyDate(date, timeBuiltOption)}</div>
						</div>
						<div className="card-content-list-item-download">
							<InstallButton build={build} view={InstallButtonView.MINI} faded={isLast !== true} />
						</div>
					</Link>
				</div>
			)
		} else {
			return (
				<div className="card-content-list-item-wrap">
					<Link to={link} className="card-content-list-item">
						<div className="card-content-list-item-all">
							<div className="card-content-list-item-all-big">Show all</div>
							<div className="card-content-list-item-all-small">
								{this.getBuildCountString(buildCount)}
							</div>
						</div>
					</Link>
				</div>
			)
		}
	}
}
