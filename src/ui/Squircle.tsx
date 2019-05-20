import React from 'react'
import cn from 'classnames'

import './Squircle.sass'
import border from './Squircle-assets/Squircle-border.svg'

import getContrastColor from 'utils/getContrastColor'

interface SquircleProps {
	className?: any
	style?: React.CSSProperties
	src?: string
	alt?: string
	srcSet?: any
	placeholder?: string
	color?: string
}

export default class Squircle extends React.Component<SquircleProps> {
	render() {
		return (
			<div
				className={cn('Squircle', this.props.className, this.props.src && 'view-hasSrc')}
				style={this.props.style}
			>
				<div className="Squircle-in">
					<div
						className="Squircle-image"
						style={{
							backgroundColor: this.props.color,
							color: this.props.color && getContrastColor(this.props.color),
						}}
					>
						{this.props.src ? (
							<img src={this.props.src} alt={this.props.alt || ''} srcSet={this.props.srcSet} />
						) : (
							<div className="Squircle-placeholder">
								{this.props.placeholder && (
									<svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
										<text x="50%" y="69%" textAnchor="middle" fill="currentColor">
											{this.props.placeholder}
										</text>
									</svg>
								)}
							</div>
						)}
					</div>
					<div className="Squircle-border">
						<img src={border} alt="" />
					</div>
				</div>
			</div>
		)
	}
}
