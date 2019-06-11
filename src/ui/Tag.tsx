import React from 'react'
import './Tag.sass'

interface TagProps {
	value: string
	size?: string
}

export default class Tag extends React.PureComponent<TagProps> {
	render() {
		return (
			<div className={`Tag view-size-${this.props.size || 'medium'}`}>
				{this.props.value}
			</div>
		)
	}
}
