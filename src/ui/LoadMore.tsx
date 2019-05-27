import React from 'react'
import cn from 'classnames'
import './LoadMore.sass'

type LoadMoreItem = any

export interface LoadMoreProps {
	renderItem?: (item: LoadMoreItem) => React.ReactNode
	loadPage?: (page: number) => Promise<null | LoadMoreItem[]>
	renderEmptyState?: () => React.ReactNode
	renderHeader?: (self: LoadMore) => React.ReactNode
	className?: any
	itemsClassName?: any
}

export interface LoadMoreState {
	items?: LoadMoreItem[]
	page: number
	isLoadingPages: boolean
	hasReachedEnd: boolean
}

export default class LoadMore extends React.Component<LoadMoreProps, LoadMoreState> {
	state: LoadMoreState = {
		page: 0,
		isLoadingPages: false,
		hasReachedEnd: false,
	}

	observer: IntersectionObserver | undefined

	tailRef = (el: HTMLDivElement | null) => {
		if (el) {
			const options = {
				rootMargin: '0px',
				threshold: 1.0,
			}

			this.observer = new IntersectionObserver(this.handleReachEnd, options)

			this.observer.observe(el)
		} else {
			if (this.observer) {
				this.observer.disconnect()
			}
		}
	}

	handleReachEnd = (entries: any, observer: IntersectionObserver) => {
		const entry = entries[0]

		if (entry) {
			if (entry.isIntersecting && !this.state.hasReachedEnd) {
				this.startLoadingPages()
			} else {
				this.stopLoadingPages()
			}
		}
	}

	renderItem = (item: LoadMoreItem, i: number) => {
		return (
			<React.Fragment key={i}>
				{this.props.renderItem ? (
					this.props.renderItem(item)
				) : (
					<pre>{JSON.stringify(item, null, 2)}</pre>
				)}
			</React.Fragment>
		)
	}

	startLoadingPages = () => {
		if (!this.state.isLoadingPages) {
			this.setState({ isLoadingPages: true, hasReachedEnd: false }, this.keepLoadingNextPage)
		}
	}

	stopLoadingPages = () => {
		this.setState({ isLoadingPages: false })
	}

	keepLoadingNextPage = () => {
		if (this.state.isLoadingPages && !this.state.hasReachedEnd) {
			this.loadNextPage().then(this.keepLoadingNextPage)
		}
	}

	loadNextPage = () => {
		return new Promise((resolve) =>
			this.setState(
				(state) => ({ ...state, page: state.page + 1 }),
				() =>
					this.loadPage(this.state.page).then((items) => {
						if (items === null || items.length === 0) {
							this.setState(
								(state) => ({ ...state, hasReachedEnd: true, isLoadingPages: false }),
								resolve
							)
						} else {
							this.setState(
								(state) => ({ ...state, items: [...(state.items || []), ...items] }),
								resolve
							)
						}
					})
			)
		)
	}

	loadPage = (page: number): Promise<LoadMoreItem[] | null> => {
		if (this.props.loadPage) {
			return this.props.loadPage(page)
		}
		return Promise.resolve(null)
	}

	isEmpty() {
		return !this.state.items || !this.state.items.length
	}

	renderEnd() {
		if (this.state.hasReachedEnd) {
			if (this.isEmpty()) {
				if (this.props.renderEmptyState) {
					return this.props.renderEmptyState()
				}
				return <div className="LoadMore-emptyResultNote">no results</div>
			}
			return <div className="LoadMore-endIndicator">no more results</div>
		}
		return null
	}

	render() {
		return (
			<div
				className={cn(
					'LoadMore',
					this.props.className,
					this.state.isLoadingPages && 'view-isLoading',
					this.state.hasReachedEnd && 'view-hasReachedEnd'
				)}
			>
				{this.props.renderHeader && this.props.renderHeader(this)}
				<div className={cn('LoadMore-items', this.props.itemsClassName)}>
					{this.state.items && this.state.items.map(this.renderItem)}
				</div>
				<div className="LoadMore-tail" ref={this.tailRef} />
				{this.state.isLoadingPages && <div className="LoadMore-loadingIndicator">loading…</div>}
				{this.renderEnd()}
			</div>
		)
	}
}
