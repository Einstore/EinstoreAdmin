import React from 'react'
import './jumbotron.sass'
import Button from "./button";
import {Link} from "@reach/router";

export interface JumbotronButton {
	text: string
	action: any
	icon?: any
}

export interface JumbotronLink {
	text: string
	to: string
	icon?: any
}

export interface JumbotronProps {
	headline: string
	text?: string
	buttons?: Array<JumbotronButton>
	links?: Array<JumbotronLink>
}

export default class Jumbotron extends React.Component<JumbotronProps> {
	render() {
		return (
			<div className="jumbotron">
				<h2 className="jumbotron-header">{this.props.headline}</h2>
				{this.props.text &&
	        <p className="jumbotron-text">{this.props.text}</p>
				}
				<div className="jumbotron-actions">
					{this.props.buttons && this.props.buttons.map((button, index) => (
						<Button className="view-inline" onClick={button.action} key={index}>
							{!!button.icon && button.icon	}
							{button.text}
						</Button>
					))}
					{this.props.links && this.props.links.map((link, index) => (
						<Link
							key={index}
							to={link.to}
							className="button view-inline"
						>
							{!!link.icon && link.icon	}
							{link.text}
						</Link>
					))}
				</div>
			</div>
		)
	}
}
