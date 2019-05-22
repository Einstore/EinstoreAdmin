import { Config } from '../Config'
import { captureException } from 'utils/logging'

export interface Networkable {}

export class NotAuthorizedError extends Error {}

export class ServerError extends Error {}

export class Networking implements Networkable {
	public config: Config

	public jwt: string | null = null

	// Initialization

	public constructor(public conf: Config) {
		this.config = conf

		if (this.config.url.substr(0, 4) !== 'http') {
			throw new Error('Please set `REACT_APP_API_URL` env variable.')
		}
	}

	public normalizeUrl = (path: string) => {
		if (path.substr(0, 4) !== 'http') {
			path = this.config.url + path
		}
		return path
	}

	public processResponse = (response: Response): Response | Promise<Response> => {
		if (response.status === 401) {
			this.config.onLoggedOut(401)
			throw new NotAuthorizedError(`401: Req ${response.url}`)
		} else if (response.status >= 500) {
			return response.json().then((err) => {
				let exception

				if (err.error === 'server_err') {
					exception = new ServerError(`Req ${response.url}: ${response.status} ${err.description}`)
				} else if (err.error) {
					exception = new Error(`Req ${response.url}: ${response.status} ${JSON.stringify(err)}`)
				}

				if (exception) {
					console.trace(exception)
					captureException(exception)
					throw exception
				}

				return err
			})
		}
		return response
	}

	// Requests

	public get = (
		path: string,
		headers: Headers = new Headers(),
		followRedirect: boolean = true
	): Promise<Response> => {
		console.log('GET', path)
		path = this.normalizeUrl(path)
		const promise = window
			.fetch(path, {
				headers: this.headers(headers),
				method: 'GET',
				redirect: followRedirect ? 'follow' : undefined,
			})
			.then(this.processResponse)

		return promise
	}

	public memoizedGet = this.get

	public postJson = (
		path: string,
		json: object,
		headers: Headers = new Headers()
	): Promise<Response> => {
		path = this.normalizeUrl(path)
		const promise = window.fetch(path, {
			body: JSON.stringify(json),
			headers: this.headers(headers),
			method: 'POST',
		})
		/*promise.then((response) => {
			if (response.status === 401) {
				this.config.onLoggedOut(401)
			}
		})*/
		return promise
	}

	public postData = (
		path: string,
		data: string | FormData | File,
		headers: Headers = new Headers()
	): Promise<Response> => {
		console.log(path)
		path = this.normalizeUrl(path)
		const promise = window.fetch(path, {
			body: data,
			headers: this.headers(headers),
			method: 'POST',
		})
		promise.then(this.processResponse)
		return promise
	}

	public put = (path: string, json: JSON, headers: Headers = new Headers()): Promise<Response> => {
		console.log(path)
		path = this.normalizeUrl(path)
		const promise = window.fetch(path, {
			body: JSON.stringify(json),
			headers: this.headers(headers),
			method: 'PUT',
		})
		promise.then(this.processResponse)
		return promise
	}

	public putJson = (
		path: string,
		json: object,
		headers: Headers = new Headers()
	): Promise<Response> => {
		console.log(path)
		path = this.normalizeUrl(path)
		const promise = window.fetch(path, {
			body: JSON.stringify(json),
			headers: this.headers(headers),
			method: 'PUT',
		})
		return promise
	}

	public patch = (
		path: string,
		json: JSON,
		headers: Headers = new Headers()
	): Promise<Response> => {
		console.log(path)
		path = this.normalizeUrl(path)
		const promise = window.fetch(path, {
			body: JSON.stringify(json),
			headers: this.headers(headers),
			method: 'PATCH',
		})
		promise.then(this.processResponse)
		return promise
	}

	public delete = (path: string, headers: Headers = new Headers()): Promise<Response> => {
		path = this.normalizeUrl(path)
		const promise = window.fetch(path, {
			headers: this.headers(headers),
			method: 'DELETE',
		})
		promise.then(this.processResponse)
		return promise
	}

	// Private interface

	private headers = (headers: Headers): Headers => {
		headers = this.appendHeader(headers, 'Content-Type', 'application/json')
		if (this.jwt) {
			headers = this.appendHeader(headers, 'Authorization', this.jwt)
		}
		headers = this.appendHeader(headers, 'User-Agent', 'EinstoreSDK/1.0-JS')
		return headers
	}

	private appendHeader = (headers: Headers, header: string, value: string): Headers => {
		if (!headers.has(header)) {
			headers.append(header, value)
		}
		return headers
	}
}
