import { Boost } from './connector/Boost'
import { BoostApp } from './App'

declare global {
	interface Window {
		API_URL: string
		rootApp?: BoostApp
		Boost: Boost
		logout: () => void
		MSStream?: boolean
	}
}
