import React, { Component } from 'react'
import './button.sass'
import cn from 'classnames'

export default class Button extends Component {
	render() {
		return (
			<button
				className={cn('button', this.props.inactive && 'inactive', this.props.danger && 'danger', this.props.className)}
				onClick={this.props.onClick}
			>
				{this.props.children}
			</button>
		)
	}
}
