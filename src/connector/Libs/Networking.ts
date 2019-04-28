import { Config } from '../Config'
export interface Networkable {}

export class NotAuthorizedError extends Error {}

export class Networking implements Networkable {
	public config: Config

	public jwt: string | null = null

	// Initialization

	public constructor(public conf: Config) {
		this.config = conf

		if (this.config.url === '%REACT_APP_API_URL%') {
			throw new Error('Please set `REACT_APP_API_URL` env variable.')
		}
	}

	// Requests

	public get = (path: string, headers: Headers = new Headers()): Promise<Response> => {
		console.log('GET', path)
		path = this.config.url + path
		const promise = window
			.fetch(path, {
				headers: this.headers(headers),
				method: 'GET',
				redirect: 'follow',
			})
			.then((response) => {
				if (response.status === 401) {
					this.config.onLoggedOut(401)
					console.trace(response)
					throw new NotAuthorizedError(`401: GET ${path}`)
				}
				return response
			})

		return promise
	}

	public memoizedGet = this.get

	public postJson = (
		path: string,
		json: object,
		headers: Headers = new Headers()
	): Promise<Response> => {
		console.log(path)
		path = this.config.url + path
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
		path = this.config.url + path
		const promise = window.fetch(path, {
			body: data,
			headers: this.headers(headers),
			method: 'POST',
		})
		promise.then((response) => {
			if (response.status === 401) {
				this.config.onLoggedOut(401)
			}
		})
		return promise
	}

	public put = (path: string, json: JSON, headers: Headers = new Headers()): Promise<Response> => {
		console.log(path)
		path = this.config.url + path
		const promise = window.fetch(path, {
			body: JSON.stringify(json),
			headers: this.headers(headers),
			method: 'PUT',
		})
		promise.then((response) => {
			if (response.status === 401) {
				this.config.onLoggedOut(401)
			}
		})
		return promise
	}

	public putJson = (
		path: string,
		json: object,
		headers: Headers = new Headers()
	): Promise<Response> => {
		console.log(path)
		path = this.config.url + path
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
		path = this.config.url + path
		const promise = window.fetch(path, {
			body: JSON.stringify(json),
			headers: this.headers(headers),
			method: 'PATCH',
		})
		promise.then((response) => {
			if (response.status === 401) {
				this.config.onLoggedOut(401)
			}
		})
		return promise
	}

	public delete = (path: string, headers: Headers = new Headers()): Promise<Response> => {
		path = this.config.url + path
		const promise = window.fetch(path, {
			headers: this.headers(headers),
			method: 'DELETE',
		})
		promise.then((response) => {
			if (response.status === 401) {
				this.config.onLoggedOut(401)
			}
		})
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
