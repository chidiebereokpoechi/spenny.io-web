import React from 'react'
import { Router } from './components/routing'
import { routes } from './pages/routes'

export const App: React.FC = () => {
    return <Router routes={routes} />
}
