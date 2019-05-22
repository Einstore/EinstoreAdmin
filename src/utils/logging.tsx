import * as Sentry from '@sentry/browser'
import React, { ErrorInfo, MouseEvent } from 'react'

export const captureException = Sentry.captureException
export const captureEvent = Sentry.captureEvent
export const captureMessage = Sentry.captureMessage

let isSentryOn = false

if (window.SENTRY_DSN && window.SENTRY_DSN.substr(0, 4) === 'http') {
	Sentry.init({ dsn: window.SENTRY_DSN })

	Sentry.configureScope((scope) => {
		scope.setExtra('api url', window.API_URL)
	})

	isSentryOn = true
}

export class ErrorBoundary extends React.Component {
	state = {
		error: null,
		errorInfo: null,
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ error, errorInfo })
		if (isSentryOn) {
			Sentry.withScope((scope) => {
				scope.setExtra('error info', errorInfo)
				Sentry.captureException(error)
			})
		}
	}

	handleReportIssue = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		Sentry.lastEventId() && Sentry.showReportDialog()
	}

	render() {
		if (this.state.error) {
			return (
				<div style={{ margin: 'auto', padding: 10, textAlign: 'center' }}>
					<div
						style={{
							display: 'inline-block',
							background: '#e33',
							color: '#fff',
							padding: '10px 30px 20px',
							borderRadius: 5,
						}}
					>
						<p>We're sorry — something's gone wrong.</p>
						{isSentryOn && (
							<>
								<p>Our team has been notified, but click the button to fill out a report.</p>
								<div>
									<button type="button" onClick={this.handleReportIssue}>
										Report issue
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)
		} else {
			return this.props.children
		}
	}
}
