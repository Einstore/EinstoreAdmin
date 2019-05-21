import cn from 'classnames'
import CryptoJS from 'crypto-js'
import React from 'react'
import './gravatar.sass'
import Squircle, { SquircleRadius } from 'ui/Squircle'

interface GravatarProps {
	email?: string
	className?: string
}

export default class Gravatar extends React.PureComponent<GravatarProps> {
	render() {
		if (!this.props.email) {
			return null
		}
		const hash = CryptoJS.MD5(this.props.email)
		return (
			<div className={cn('gravatar', this.props.className)}>
				<Squircle
					radius={SquircleRadius.L}
					src={`https://www.gravatar.com/avatar/${hash}?s=66`}
					srcSet={`https://www.gravatar.com/avatar/${hash}?s=66, https://www.gravatar.com/avatar/${hash}?s=99 1.5x, https://www.gravatar.com/avatar/${hash}?s=132 2x`}
				/>
			</div>
		)
	}
}
