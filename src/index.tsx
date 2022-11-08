import React from 'react'
import ReactDOM from 'react-dom/client'
import 'reflect-metadata'
import { App } from './app'
import './index.css'
import reportWebVitals from './report-web-vitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

reportWebVitals()
