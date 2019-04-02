import React, { Component } from 'react'
import './textInput.sass'

const nontextualTypes = ['color']

export default class TextInput extends Component {
	render() {
		return (
			<input
				className={nontextualTypes.indexOf(this.props.type) === -1 && 'textInput'}
				{...this.props}
				ref={this.props.inputRef}
			/>
		)
	}
}
