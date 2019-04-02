import React from 'react'
import cn from 'classnames'

import './Alert.sass'

/*
import Alert, { AlertView } from './components/Alert'

<div className="alerts">
	<Alert text="Lorem ipsum dolor sit amet. default" />
	<Alert text="Lorem ipsum dolor sit amet. INFO" view={AlertView.INFO} />
	<Alert text="Lorem ipsum dolor sit amet. SUCCESS" view={AlertView.SUCCESS} />
	<Alert text="Lorem ipsum dolor sit amet. WARNING" view={AlertView.WARNING} />
	<Alert text="Lorem ipsum dolor sit amet. DANGER" view={AlertView.DANGER} />
</div>
*/

export enum AlertView {
	SUCCESS = 'success',
	INFO = 'info',
	WARNING = 'warning',
	DANGER = 'danger',
}

interface State {}

interface Props {
	view: AlertView
	text: string
	html: string
	onDismiss: () => void
	onClick: () => void
}

export default class Alert extends React.Component<Props, State> {
	render() {
		return (
			<div className={cn('alert', 'view-' + this.props.view)} onClick={this.props.onClick}>
				<div className="alert-text">
					{this.props.text && <p>{this.props.text}</p>}
					{this.props.html && <div dangerouslySetInnerHTML={{ __html: this.props.html }} />}
				</div>
				<div className="alert-actions">
					<button role="button" className="alert-close-button" onClick={this.props.onDismiss}>
						&times;
					</button>
				</div>
			</div>
		)
	}
}
