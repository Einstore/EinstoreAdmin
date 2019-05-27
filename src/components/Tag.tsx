import React from 'react'
import './tag.sass'

interface TagProps {
	value?: string
	size?: string
}

export default class Tag extends React.PureComponent<TagProps> {
	render() {
		if (!this.props.value) {
			return null
		}
		return (
			<div className={this.props.size ? 'tag tag-' + this.props.size : 'tag tag-medium'}>
				{this.props.value}
			</div>
		)
	}
}
