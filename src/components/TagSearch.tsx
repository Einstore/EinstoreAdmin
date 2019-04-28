import React from 'react'
import AsyncSelect from 'react-select/lib/Async'
import { SearchSuggestionType, SearchSuggestion } from '../connector/Model/SearchSuggestion'
import { App } from '../connector/Model/App'
import { AppTag } from '../connector/Model/AppTag'
import AppIcon from './AppIcon'
import './tagSearch.sass'

type State = {
	inputValue: string
	options: any[]
	defaultOptions: any[]
}

type Props = {
	teamId?: string
	options?: any[]
	onChange?: (values: any[]) => void
}

function AppLabel({ app }: { app: App }) {
	return (
		<span className="tagSearch-appLabel">
			<span className="tagSearch-appLabel-icon">
				<AppIcon empty={!app.icon} name={app.name || ''} id={app.id || ''} />
			</span>{' '}
			{app.name}
		</span>
	)
}

export default class WithCallbacks extends React.Component<Props, State> {
	state = {
		inputValue: '',
		options: this.props.options || [],
		defaultOptions: [],
	}

	filterOptions = (inputValue: string) => {
		if (inputValue) {
			return this.state.options.filter((i) =>
				i.label.toLowerCase().includes(inputValue.toLowerCase())
			)
		}
		return this.state.options
	}

	private lastInput: any = null

	loadOptions = (inputValue: any) => {
		this.lastInput = inputValue
		if (!inputValue || inputValue.length < 3) {
			return Promise.resolve([])
		}
		return window.Einstore.getSuggestions(inputValue, this.props.teamId).then((suggestions) => {
			if (this.lastInput === inputValue) {
				return suggestions.slice(0, 100).map((item: SearchSuggestion) => {
					switch (item.type) {
						case SearchSuggestionType.APP:
							const app = item.current as App
							return {
								label: <AppLabel app={app} />,
								value: '@@' + app.identifier,
								entity: app,
								type: item.type,
							}
						case SearchSuggestionType.TAG:
							const tag = item.current as AppTag
							return { label: tag.identifier, value: tag.identifier, entity: tag, type: item.type }
						default:
							return null
					}
				})
			} else {
				console.log('wrong lastinput', this.lastInput, inputValue)
			}
			return []
		})
	}

	handleInputChange = (newValue: string) => {
		const inputValue = newValue.replace(/\W/g, '')
		this.setState({ inputValue })
		return inputValue
	}

	handleChange = (val: any[]) => {
		if (this.props.onChange) {
			this.props.onChange(val.map((item) => item.value))
		}
	}

	componentDidMount() {
		window.Einstore.commonTags(this.props.teamId || undefined).then((commonTags: any) => {
			this.setState({
				defaultOptions: commonTags.map((item: any) => ({
					label: item.identifier,
					value: item.identifier,
				})),
			})
		})
	}

	render() {
		return (
			<AsyncSelect
				cacheOptions
				loadOptions={this.loadOptions}
				defaultOptions={this.state.defaultOptions}
				onInputChange={this.handleInputChange}
				isMulti
				placeholder="Search…"
				onChange={this.handleChange}
			/>
		)
	}
}
