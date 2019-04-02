import React, { MouseEvent } from 'react'
import './platformSwitch.sass'
import IconAndroid from '../shapes/android'
import IconIos from '../shapes/ios'

export enum PlatformSwitchValue {
	IOS = 'ios',
	ANDROID = 'android',
	ALL = 'all',
}

export interface PlatformSwitchProps {
	value?: PlatformSwitchValue | null
	onChange?: (value: PlatformSwitchValue) => void
}

export default class PlatformSwitch extends React.Component<PlatformSwitchProps> {
	handleChange = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		const value = e.currentTarget.value as PlatformSwitchValue

		if (this.props.value !== value && this.props.onChange) {
			this.props.onChange(value)
		}
	}

	render() {
		return (
			<div className="platformSwitch">
				<button
					role="button"
					value={PlatformSwitchValue.ALL}
					className={this.props.value === PlatformSwitchValue.ALL ? 'view-active' : undefined}
					onClick={this.handleChange}
				>
					All
				</button>
				<button
					role="button"
					value={PlatformSwitchValue.ANDROID}
					className={this.props.value === PlatformSwitchValue.ANDROID ? 'view-active' : undefined}
					onClick={this.handleChange}
				>
					<IconAndroid />
				</button>
				<button
					role="button"
					value={PlatformSwitchValue.IOS}
					className={this.props.value === PlatformSwitchValue.IOS ? 'view-active' : undefined}
					onClick={this.handleChange}
				>
					<IconIos />
				</button>
			</div>
		)
	}
}
