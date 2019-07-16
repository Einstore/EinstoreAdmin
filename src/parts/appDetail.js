import { without } from 'lodash-es'
import React, { Component } from 'react'
import CardInfo from '../components/cardInfo'
import CardTags from '../components/cardTags'
import IconBack from '../shapes/back'
import './page.sass'
import IconTrash from '../shapes/trash'
import usure from '../utils/usure'
import { navigate } from '@reach/router'
import pageTitle from "../utils/pageTitle";

export default class AppDetail extends Component {
	state = {
		loaded: false,
		id: this.props.buildId,
		name: '',
		identifier: '',
		build: 0,
		version: '',
		info: null,
		platform: '',
		built: null,
	}

	componentDidMount() {
		window.Einstore.build(this.state.id)
			.then((result) => {
				console.log(result)
				if (typeof result.error !== 'undefined') {
					throw new Error()
				}
				this.setState({
					...result,
					loaded: true,
				})
				pageTitle(this.state.name)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	getTags = (force = false) => {
		const current = (this.state.tags && this.state.tags.current) || []
		if (!this.state.tags || force) {
			this.setState({ tags: { loading: true, current } }, () => {
				window.Einstore.getAppTags(this.state.id).then((tags) => {
					this.setState((state) => ({
						...state,
						tags: {
							...state.tags,
							loading: false,
							success: true,
							current: tags,
						},
					}))
				})
			})
			return current
		}

		return this.state.tags.current
	}

	deleteTag = (tag) => {
		this.setState((state) => {
			return {
				...state,
				tags: {
					...state.tags,
					current: without(state.tags.current, tag),
				},
			}
		})
		window.Einstore.deleteBuildTag(this.state.id, tag.id)
	}

	lastAddedTag = null

	addTag = (tag) => {
		this.lastAddedTag = tag
		window.Einstore.addAppTag(this.state.id, tag).then((tags) => {
			this.setState((state) => {
				return {
					...state,
					tags: {
						...state.tags,
						current: [...state.tags.current, ...tags],
					},
				}
			})
		})
	}

	handleDelete = () => {
		usure().then(() => {
			window.Einstore.deleteBuild(this.state.id).then(() => navigate('/apps'))
		})
	}

	render() {
		const tags = this.getTags()
		console.log(tags)
		return (
			<div className="page">
				<div className="page-controls">
					<div className="page-control is-active" onClick={() => window.history.back()}>
						<IconBack /> Back
					</div>
				</div>
				<CardInfo
					name={this.state.name}
					icon={this.state.icon}
					versionNumber={this.state.version}
					info={this.state.info}
					versionCode={this.state.build}
					id={this.state.identifier}
					platform={this.state.platform}
					uuid={this.state.id}
					size={this.state.size}
					date={this.state.built}
				/>
				<CardTags tags={tags} lastAddedTag={this.lastAddedTag} onDeleteTag={this.deleteTag} onAddTag={this.addTag} />

				<div
					style={{
						textAlign: 'right',
						padding: 20,
						maxWidth: 1200,
						margin: '0 auto',
						boxSizing: 'border-box',
					}}
				>
					<span className="api-action api-action-red" onClick={this.handleDelete}>
						<IconTrash /> Delete this build
					</span>
				</div>
			</div>
		)
	}
}
