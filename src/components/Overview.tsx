import { Link } from '@reach/router'
import React, { Component } from 'react'
import Button from '../components/button'
import CardList from '../components/cardList'
import TagSearch from '../components/TagSearch'
import { Layout } from '../parts/Layout'
import '../parts/page.sass'
import './searchResults.sass'
import './Sort.sass'
import AppIcon from './AppIcon'
import TeamName from './TeamName'
import bytes from 'pretty-bytes'
import prettyDate from '../utils/prettyDate'
import PlatformSwitch, { PlatformSwitchValue } from './PlatformSwitch'
import InstallButton, { InstallButtonView } from './InstallButton'
import detectOS, { OSName } from '../utils/detectOS'

export interface OverviewProps {
	teamId?: string
	layout: Layout
}

export enum SortDirection {
	ASC = 'asc',
	DESC = 'desc',
}

export enum SortValue {
	NAME = 'name',
	DATE = 'date',
}

export interface SortProps {
	value: SortValue
	direction: SortDirection
	onChange: (value: SortValue, direction: SortDirection) => void
}

const switchSortDirection = {
	[SortDirection.ASC]: SortDirection.DESC,
	[SortDirection.DESC]: SortDirection.ASC,
}

function Sort({ value, direction, onChange }: SortProps) {
	return (
		<span className="Sort">
			Sort by{' '}
			<span
				className={`Sort-key is-${value === SortValue.DATE ? 'active' : 'inactive'}`}
				onClick={() => onChange(SortValue.DATE, switchSortDirection[direction])}
			>
				<span className="Sort-key-name">date</span>{' '}
				<span className={`Sort-direction view-${direction}`}>►</span>
			</span>{' '}
			<span
				className={`Sort-key is-${value === SortValue.NAME ? 'active' : 'inactive'}`}
				onClick={() => onChange(SortValue.NAME, switchSortDirection[direction])}
			>
				<span className="Sort-key-name">name</span>{' '}
				<span className={`Sort-direction view-${direction}`}>►</span>
			</span>
		</span>
	)
}

class SearchResults extends Component<{ tags: string[] }, { apps: any[] }> {
	state = {
		apps: [],
	}
	componentDidMount() {
		window.Einstore.filterApps({ limit: 10, tags: this.props.tags }).then((apps) => {
			this.setState({ apps })
		})
	}
	render() {
		return (
			<div className="card">
				<div className="card-header" style={{ textAlign: 'center' }}>
					Search results
				</div>
				<div className="card-content">
					<div className="searchResults">
						<div className="searchResults-items">
							{this.state.apps.length === 0 && <p style={{ textAlign: 'center' }}>No results…</p>}
							{this.state.apps.map((app: any) => (
								<div key={app.id} className="searchResults-item">
									<div className="card-content-list-item-wrap">
										<Link to={'/build/' + app.id} className="card-content-list-item">
											<div className="card-content-list-item-image">
												<AppIcon empty={!app.icon} name={app.name} id={app.id} />
											</div>
											<div className="card-content-list-item-text">
												<div>
													<TeamName teamId={app.team_id} />
												</div>
												<div className="card-content-list-item-text-version">{app.name}</div>
												<div className="card-content-list-item-text-date">
													{app.identifier} <small>({app.version})</small>
												</div>
												<div className="card-content-list-item-text-date">
													{prettyDate(app.created)} <small>({bytes(app.size)})</small>
												</div>
											</div>
											<div className="card-content-list-item-download">
												<InstallButton build={app} view={InstallButtonView.MINI} />
											</div>
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

let initialPlatform = PlatformSwitchValue.ALL
const os = detectOS()
switch (os) {
	case OSName.ANDROID:
		initialPlatform = PlatformSwitchValue.ANDROID
		break
	case OSName.IOS:
		initialPlatform = PlatformSwitchValue.IOS
		break
	default:
}

export default class Overview extends Component<OverviewProps> {
	state = {
		loaded: false,
		loadingStatus: 'start',
		data: [],
		loadingTotal: 1,
		loadingCurrent: 0,
		appsOffset: 0,
		isFetchingAdditionalApps: false,
		noApps: false,
		searchTags: [],
		platform: initialPlatform,
		sort: {
			value: SortValue.DATE,
			direction: SortDirection.DESC,
		},
	}

	componentDidMount() {
		this.fetchApps()
		window.addEventListener('scroll', this.handleScroll, { capture: true, passive: true })
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	fetchApps = () => {
		this.setState({
			isFetchingAdditionalApps: true,
		})
		const shouldHandleScroll = this.state.appsOffset === 0
		window.Einstore.overview(
			this.props.teamId,
			9,
			this.state.appsOffset,
			undefined,
			this.state.platform,
			this.state.sort.value + ':' + this.state.sort.direction
		)
			.then((result: any) => {
				if (typeof result.error !== 'undefined') {
					throw new Error()
				}
				this.setState({
					loaded: true,
					data: this.state.data.concat(result),
					loadingStatus: 'ajax',
					loadingCurrent: 1,
					appsOffset: this.state.appsOffset + 10,
					isFetchingAdditionalApps: false,
					noApps: this.state.data.concat(result).length === 0,
				})
			})
			.catch((error: any) => {
				console.error(error)
				this.setState({
					isFetchingAdditionalApps: false,
				})
			})
			.then(() => {
				if (shouldHandleScroll) {
					setTimeout(() => {
						this.handleScroll({ target: document.querySelector('.layout-fg-body') })
					})
				}
			})
	}

	handleScroll = (e: any) => {
		const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
		if (bottom) {
			if (this.state.isFetchingAdditionalApps === false) {
				this.fetchApps()
			}
		}
	}

	refresh = () => {
		this.setState({ appsOffset: 0, data: [], appData: {} }, () => this.fetchApps())
	}

	handleTagSearchChange = (tags: string[]) => {
		this.setState({ searchTags: tags })
	}

	handlePlatformChange = (platform: PlatformSwitchValue) => {
		this.setState({ platform }, this.refresh)
	}

	handleSortChange = (value: SortValue, direction: SortDirection) => {
		this.setState({ sort: { value, direction } }, this.refresh)
	}

	render() {
		return this.state.loaded === false ? (
			<div id="loading">
				<div className="loading-line" />
			</div>
		) : this.state.noApps === false ? (
			<div className="page">
				<div className="page-controls">
					<div className="page-control view-primary">
						<TagSearch
							key={this.props.teamId || 'all'}
							teamId={this.props.teamId}
							onChange={this.handleTagSearchChange}
						/>
					</div>
					<div className="page-control view-platformSwitch">
						<PlatformSwitch value={this.state.platform} onChange={this.handlePlatformChange} />
					</div>
					<div className="page-control hide-s">
						<Sort
							value={this.state.sort.value}
							direction={this.state.sort.direction}
							onChange={this.handleSortChange}
						/>
					</div>
				</div>
				{this.state.searchTags.length > 0 && (
					<SearchResults key={JSON.stringify(this.state.searchTags)} tags={this.state.searchTags} />
				)}
				<div className="page-cards-list">
					{this.state.data.map((item: any, key) => {
						return (
							<div className="page-cards-list-item" key={key}>
								<CardList
									index={key}
									name={item.latest_app_name}
									id={item.identifier}
									versionCode={item.latest_app_build}
									platform={item.platform}
									buildCount={item.build_count}
									cluster_id={item.id}
									teamId={item.team_id !== this.props.teamId ? item.team_id : null}
								/>
							</div>
						)
					})}
				</div>
			</div>
		) : (
			<div className="page">
				{this.props.teamId ? (
					<div className="page-upload">
						<p className="page-upload-text">No apps here yet.</p>
						<Button onClick={this.props.layout.openDropzone}>Upload app</Button>
					</div>
				) : (
					<div className="page-upload">
						<p className="page-upload-text">No apps here yet. Select team to add new build.</p>
					</div>
				)}
			</div>
		)
	}
}
