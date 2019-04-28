import { Einstore } from './connector/Einstore'
import { EinstoreApp } from './App'

declare global {
	interface Window {
		API_URL: string
		PREFILLED_CREDENTIALS: string
		rootApp?: EinstoreApp
		Einstore: Einstore
		logout: () => void
		MSStream?: boolean
	}
}
