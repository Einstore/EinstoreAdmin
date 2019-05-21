import cn from 'classnames'
import memoize from 'lodash-es/memoize'
import React, { Component } from 'react'
import './AppIcon.sass'
import Squircle from 'ui/Squircle'

interface Props {
	id: string
	name: string
	empty?: boolean
	context: string
	className?: string
	iconSize?: number
}

interface State {
	url?: string
	empty?: boolean
}

export default class AppIcon extends Component<Props, State> {
	public static defaultProps = {
		context: 'builds',
	}

	public context: any

	public state = {
		url: undefined,
		empty: false,
	}

	private loadImage = memoize(
		(empty: any, context: string, id: string) => {
			if (!empty && id) {
				const url = `/${context}/${id}/icon`
				window.Einstore.networking
					.memoizedGet(url)
					.then((res: Response) => {
						if (res.status === 500) {
							throw new Error(`500 error in image loading ${url}`)
						}
						return res
					})
					.then((res: Response) => res.blob())
					.then((blob: Blob) => {
						const urlCreator = window.URL
						const url = urlCreator.createObjectURL(blob)
						this.setState({ url, empty: false })
					})
					.catch(() => {
						this.setState({ url: undefined, empty: true })
					})
			} else {
				this.setState({ url: undefined, empty: true })
			}
		},
		(...params) => {
			return params.join(' ')
		}
	)

	public componentDidMount() {
		this.loadImage(this.props.empty, this.props.context, this.props.id)
	}

	componentDidUpdate() {
		this.loadImage(this.props.empty, this.props.context, this.props.id)
	}

	public render() {
		return (
			<div
				className={cn(
					'AppIcon',
					this.state.url ? 'view-loaded' : 'view-loading',
					this.props.className
				)}
				style={{ fontSize: this.props.iconSize }}
			>
				<span className="AppIcon-img"><Squircle src={this.state.url} /></span>
			</div>
		)
	}
}
