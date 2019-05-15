import React from 'react'
import './SecurityOverview.sass'
import { SecurityMessage } from 'connector/Einstore'
import Alert from './Alert'

interface SecurityOverviewProps {}

interface SecurityOverviewState {
	issues?: SecurityMessage[]
}

export default class SecurityOverview extends React.PureComponent<
	SecurityOverviewProps,
	SecurityOverviewState
> {
	state: SecurityOverviewState = {}
	componentDidMount() {
		this.fetchSecurityMessages()
	}
	fetchSecurityMessages() {
		window.Einstore.security().then((state) => this.setState(state))
	}
	handleDismiss = () => {
		this.setState({ issues: undefined })
	}
	render() {
		if (!this.state.issues) {
			return null
		}
		return (
			<div className="page-controls SecurityOverview">
				{this.state.issues.map((message, i) => (
					<div key={i}>
						<Alert text={message.issue} view={message.category} onDismiss={this.handleDismiss} />
					</div>
				))}
			</div>
		)
	}
}
