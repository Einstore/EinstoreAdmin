import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { unregister } from './registerServiceWorker'

import { BoostApp } from './App'

ReactDOM.render(<BoostApp />, document.getElementById('root'))

unregister()
