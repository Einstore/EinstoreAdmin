import React, { Component } from 'react'
import CardItem from './cardItem'

export default class CardListBuilds extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: props.id,
			builds: props.builds || [],
			showAll: props.showAll || false,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			id: nextProps.id,
			builds: nextProps.builds || [],
			showAll: nextProps.showAll || false,
		})
	}

	getBuildDate(dateTime) {
		let date = new Date(dateTime)
		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
	}

	render() {
		return (
			<div className="card-content-list">
				{this.state.builds.map((item, key) => {
					return (
						<CardItem
							isAll={false}
							isLast={key === 0}
							key={key}
							link={'/build/' + item.id}
							icon={item.icon}
							versionNumber={item.version}
							versionCode={item.build}
							appId={item.id}
							date={this.getBuildDate(item.created)}
							build={item}
						/>
					)
				})}
				{this.state.showAll === false ? (
					<CardItem
						isAll={!this.state.showAll}
						isLast={false}
						link={'/app/' + this.state.cluster_id}
						icon={this.props.icon}
					/>
				) : null}
			</div>
		)
	}
}
