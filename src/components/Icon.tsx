import React from 'react'
import cn from 'classnames'
import './icon.sass'

interface IconProps {
	className?: string
	src?: string
	srcSet?: string
	alt?: string
}

export default class Icon extends React.Component<IconProps> {
	render() {
		return (
			<div className={cn('einstoreIcon', this.props.className)}>
				<img src={this.props.src} srcSet={this.props.srcSet} alt={this.props.alt} />
			</div>
		)
	}
}
