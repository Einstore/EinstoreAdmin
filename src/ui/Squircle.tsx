import React from 'react'
import cn from 'classnames'

import './Squircle.sass'
import borderS from './Squircle-assets/Squircle-S-border.svg'
import borderM from './Squircle-assets/Squircle-M-border.svg'
import borderL from './Squircle-assets/Squircle-L-border.svg'

import getContrastColor from 'utils/getContrastColor'
import normalizeColor from 'utils/normalizeColor'

export enum SquircleRadius {
	S = 'S',
	M = 'M',
	L = 'L',
}

const radiusBorders = {
	[SquircleRadius.S]: borderS,
	[SquircleRadius.M]: borderM,
	[SquircleRadius.L]: borderL,
}

interface SquircleProps {
	className?: any
	style?: React.CSSProperties
	src?: string
	alt?: string
	srcSet?: any
	placeholder?: string
	color?: string
	radius: SquircleRadius
}

export default class Squircle extends React.Component<SquircleProps> {
	static defaultProps = {
		radius: SquircleRadius.M,
	}

	render() {
		const color = this.props.color && normalizeColor(this.props.color)

		return (
			<div
				className={cn(
					'Squircle',
					this.props.className,
					this.props.src && 'view-hasSrc',
					`view-radius${this.props.radius}`
				)}
				style={this.props.style}
			>
				<div className="Squircle-in">
					<div
						className="Squircle-image"
						style={{
							backgroundColor: color,
							color: color && getContrastColor(color),
						}}
					>
						{this.props.src ? (
							<img src={this.props.src} alt={this.props.alt || ''} srcSet={this.props.srcSet} />
						) : (
							<div className="Squircle-placeholder">
								{this.props.placeholder && (
									<svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
										<text
											x="50%"
											y="46%"
											textAnchor="middle"
											dominantBaseline="mathematical"
											fill="currentColor"
											fontSize={17}
										>
											{this.props.placeholder}
										</text>
									</svg>
								)}
							</div>
						)}
					</div>
					<div className="Squircle-border">
						<img src={radiusBorders[this.props.radius]} alt="" />
					</div>
				</div>
			</div>
		)
	}
}
