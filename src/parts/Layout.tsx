import { Link, RouteComponentProps } from '@reach/router'
import cn from 'classnames'
import React, { ComponentType } from 'react'
import Dropzone from 'react-dropzone'
import Button from '../components/button'
import IconBars from '../shapes/bars'
import IconPlus from '../shapes/plus'
import IconTimes from '../shapes/times'
import './layout.sass'
import { Sidebar } from './Sidebar'

export enum HeaderButtonView {
	NONE = 'none',
	ADD_NEW_BUILD = 'addNewBuild',
	ADD_API_KEY = 'addApiKey',
}

interface LayoutProps {
	body: ComponentType<LayoutChildProps>
	header: ComponentType<LayoutChildProps>
	teamId?: string
	appId?: string
	buildId?: string
	headerButtonView?: HeaderButtonView
}

interface LayoutState {
	showMenu: boolean
	uploading: boolean
	rev: number
}

export interface LayoutChildProps {
	params: { [key: string]: any }
	layout: Layout
}

export class Layout extends React.Component<RouteComponentProps<LayoutProps>, LayoutState> {
	openDropzone?: () => void

	state = {
		showMenu: false,
		uploading: false,
		rev: 1,
	}

	toggleMenu = () => {
		this.setState((state) => ({ ...state, showMenu: !state.showMenu }))
	}

	showMenu = () => {
		this.setState((state) => ({ ...state, showMenu: true }))
	}

	hideMenu = () => {
		this.setState((state) => ({ ...state, showMenu: false }))
	}

	refresh = () => {
		this.setState((state) => ({ ...state, rev: state.rev + 1 }))
	}

	handleDrop = (acceptedFiles: File[], rejectedFiles: File[]) => {
		if (this.state.uploading === false && this.props.teamId) {
			if (acceptedFiles.length !== 0) {
				const teamId = this.props.teamId
				this.setState({ uploading: true })
				Promise.all(
					acceptedFiles.map((file) =>
						window.Einstore.upload(file, teamId)
							.then((result: any) => {
								if (typeof result.error !== 'undefined') {
									throw new Error()
								}
								console.log(result)
							})
							.catch((error: any) => {
								console.log(error)
							})
					)
				).then(() => {
					this.setState({ uploading: false })
					this.refresh()
				})
			}
		}
	}

	renderHeaderButton = (params: any) => {
		switch (this.props.headerButtonView) {
			case HeaderButtonView.ADD_API_KEY:
				return (
					<Link
						to={this.props.teamId ? `/add-api-key/${this.props.teamId}` : `/add-api-key`}
						className="button"
					>
						<span>
							<IconPlus /> Add <span className="hide-xs">new</span> API key
						</span>
					</Link>
				)
			case HeaderButtonView.ADD_NEW_BUILD:
				return (
					<Button onClick={this.state.uploading ? undefined : params.openFileUpload}>
						{this.state.uploading ? (
							<span>Uploading…</span>
						) : (
							<span>
								<IconPlus /> Add <span className="hide-xs">new</span> build
							</span>
						)}
					</Button>
				)
		}
		return null
	}

	render() {
		const params = {
			teamId: this.props.teamId,
			appId: this.props.appId,
			buildId: this.props.buildId,
		}

		const Body = this.props.body
		const Header = this.props.header

		const rev = this.state.rev

		return (
			<Dropzone onDrop={this.handleDrop} disableClick>
				{({ getRootProps, getInputProps, open }: any) => (
					(this.openDropzone = open),
					(
						<div
							className={cn('layout', this.state.showMenu && 'view-showMenu')}
							{...getRootProps()}
							style={null}
						>
							<input {...getInputProps()} />
							<div className="layout-in">
								<div className="layout-bg">
									{Sidebar && (
										<div className="layout-bg-sidebar">
											<Sidebar
												params={params}
												layout={this}
												activeTeam={this.props.teamId}
												onChoice={this.hideMenu}
											/>
										</div>
									)}
								</div>
								<div className="layout-fg">
									{Header && (
										<div className="layout-fg-head">
											<div className="layout-fg-head-left">
												<span role="button" className="layout-menuToggle" onClick={this.toggleMenu}>
													{this.state.showMenu ? <IconTimes /> : <IconBars />}
												</span>
											</div>
											<div className="layout-fg-head-center">
												<Header params={params} layout={this} />
											</div>
											<div className="layout-fg-head-right">
												{this.renderHeaderButton({ openFileUpload: open })}
											</div>
										</div>
									)}
									{Body && (
										<div className="layout-fg-body">
											<Body key={rev} params={params} layout={this} />
										</div>
									)}
									<div className="layout-fg-cover" onClick={this.hideMenu} />
								</div>
							</div>
						</div>
					)
				)}
			</Dropzone>
		)
	}
}
