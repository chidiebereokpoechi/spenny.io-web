import { observer } from 'mobx-react'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Route as RouteDefinition } from '../../pages/routes'
import { useStores } from '../../util/stores'
import { RouteWrapper } from './route-wrapper'

interface Props {
    routes: RouteDefinition[]
}

export const Router: React.FC<Props> = observer(({ routes }) => {
    const { auth } = useStores()

    return auth.ready ? (
        <BrowserRouter>
            <Routes>
                {routes.map(([paths, title, component, authRequirements], i) => {
                    return paths.map((path, j) => {
                        return (
                            <Route
                                key={`${i}${j}`}
                                path={path}
                                element={
                                    <RouteWrapper
                                        title={title}
                                        component={component}
                                        authRequirements={authRequirements}
                                    />
                                }
                            />
                        )
                    })
                })}
            </Routes>
        </BrowserRouter>
    ) : null
})
