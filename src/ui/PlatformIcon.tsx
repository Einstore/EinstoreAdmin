import React from 'react'
import IconIos from 'shapes/ios'
import IconAndroid from 'shapes/android'
import './PlatformIcon.sass'

interface PlatformIconProps {
	platform?: 'android' | 'ios'
}

export default class PlatformIcon extends React.PureComponent<PlatformIconProps> {
	icons = {
		android: IconAndroid,
		ios: IconIos,
	}

	render() {
		let Icon = this.props.platform && this.icons[this.props.platform]

		return (
			<span className={`PlatformIcon view-platform-${this.props.platform || 'unknown'}`}>
				{Icon && <Icon />}
			</span>
		)
	}
}
