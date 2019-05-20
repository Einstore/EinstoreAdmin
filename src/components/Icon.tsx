import React from 'react'
import cn from 'classnames'
import './icon.sass'
import Squircle from 'ui/Squircle'

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
				<Squircle src={this.props.src} srcSet={this.props.srcSet}  alt={this.props.alt} />
			</div>
		)
	}
}
