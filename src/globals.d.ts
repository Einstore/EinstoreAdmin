import { Boost } from './connector/Boost'
import { BoostApp } from './App'

declare global {
	interface Window {
		rootApp?: BoostApp
		Boost: Boost
		logout: () => void
		MSStream?: boolean
	}
}

