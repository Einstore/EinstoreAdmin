import cn from 'classnames'
import CryptoJS from 'crypto-js'
import React from 'react'
import './gravatar.sass'
import Squircle, { SquircleRadius } from 'ui/Squircle'

interface GravatarProps {
	email?: string
	className?: string
	size?: number
}

export default class Gravatar extends React.PureComponent<GravatarProps> {
	render() {
		if (!this.props.email) {
			return null
		}
		const hash = CryptoJS.MD5(this.props.email)
		const size = this.props.size || 128
		return (
			<div className={cn('gravatar', this.props.className)}>
				<Squircle
					radius={SquircleRadius.M}
					src={`https://www.gravatar.com/avatar/${hash}?s=${size}`}
					srcSet={`https://www.gravatar.com/avatar/${hash}?s=${size} ${size}w, https://www.gravatar.com/avatar/${hash}?s=${size *
						2} ${size * 2}w`}
				/>
			</div>
		)
	}
}
