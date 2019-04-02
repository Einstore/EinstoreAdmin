import React from 'react'
import { ServerContext } from './App'
import Icon from './components/Icon'

export function ServerIcon() {
	return (
		<div className="serverIcon">
			<ServerContext.Consumer>
				{(server) =>
					server && typeof server.icons !== 'undefined' && (
						<Icon
							src={server.icons[1].url}
							srcSet={`${server.icons[1].url}, ${server.icons[2].url} 2x`}
							alt={server.name}
						/>
					)
				}
			</ServerContext.Consumer>
		</div>
	)
}
