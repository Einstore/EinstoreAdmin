import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './card.sass'
import './cardTags.sass'

import Button from './button'
import IconTimes from '../shapes/times'
import IconPlus from '../shapes/plus'

export default class CardTags extends Component {
	static defaultProps = {
		tags: [],
	}

	searchRef = React.createRef()

	handleSubmit = (e) => {
		e.preventDefault()

		if (this.searchRef.current.value) {
			this.props.onAddTag(this.searchRef.current.value)
			this.searchRef.current.value = ''
		}
	}

	componentDidMount() {
		console.log(this.props.tags)
	}

	render() {
		console.log({ lastAddedTag: this.props.lastAddedTag })
		return (
			<div className="card card-columns">
				<div className="card-filtering card-column">
					<div className="card-filtering-inner">
						<form className="card-filtering-add" onSubmit={this.handleSubmit}>
							<input
								className="card-filtering-search"
								placeholder="Search or type new tag"
								type="search"
								ref={this.searchRef}
							/>
							<Button inactive>
								<IconPlus /> Add tag
							</Button>
						</form>
						<div className="card-filtering-list">
							{this.props.tags.map((tag) => (
								<div
									key={tag.id}
									className={`card-filtering-item ${
										tag.identifier === this.props.lastAddedTag ? 'is-latest' : ''
									}`}
								>
									{tag.identifier}{' '}
									<span role="button" onClick={() => this.props.onDeleteTag(tag)}>
										<IconTimes />
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

CardTags.contextTypes = {
	connector: PropTypes.object,
	token: PropTypes.string,
}
