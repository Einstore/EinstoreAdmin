import React from 'react'
import Button from './button'
import IconMobile from '../shapes/mobile'
import IconDownload from '../shapes/download'
import { App } from '../connector/Model/App'
import cn from 'classnames'

export enum InstallButtonView {
	DEFAULT = 'default',
	MINI = 'mini',
}

const downloadBuild = (build: App) => (e: React.MouseEvent<HTMLDivElement>) => {
	e.preventDefault()
	if (build.id && build.platform) {
		window.Boost.downloadCurrentPlatform(build.id, build.platform)
	}
}

export default function InstallButton({
	build,
	view,
	faded,
}: {
	build: App
	view?: InstallButtonView
	faded?: boolean
}) {
	const androidInstall =
		navigator.userAgent.toLowerCase().indexOf('android') > -1 && build.platform === 'android'
	const iosInstall =
		/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && build.platform === 'ios'
	view = view || InstallButtonView.DEFAULT
	return (
		<>
			{androidInstall || iosInstall ? (
				<Button
					inactive={view === InstallButtonView.MINI && faded}
					className={cn('card-column-download', faded && 'faded')}
					onClick={downloadBuild(build)}
				>
					<IconMobile /> {view === InstallButtonView.DEFAULT && <span>Install</span>}
				</Button>
			) : (
				<Button
					inactive={view === InstallButtonView.MINI && faded}
					className={cn('card-column-download', faded && 'faded')}
					onClick={downloadBuild(build)}
				>
					<IconDownload /> {view === InstallButtonView.DEFAULT && <span>Download</span>}
				</Button>
			)}
		</>
	)
}
