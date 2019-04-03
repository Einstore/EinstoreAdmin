import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { unregister } from './registerServiceWorker'

import { EinstoreApp } from './App'

ReactDOM.render(<EinstoreApp />, document.getElementById('root'))

unregister()
