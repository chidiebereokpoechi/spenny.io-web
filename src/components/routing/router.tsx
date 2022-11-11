import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Route as RouteDefinition } from '../../pages/routes'
import { useStores } from '../../util/stores'
import { Loader } from '../layout'
import { RouteWrapper } from './route-wrapper'

interface Props {
    routes: RouteDefinition[]
}

export const Router: React.FC<Props> = observer(({ routes }) => {
    const { authStore: auth, userStore: user } = useStores()

    useEffect(() => {
        if (auth.authenticated && !user.user) {
            user.getAuthenticatedUser().subscribe()
        }
    }, [auth.authenticated, user])

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
                                    <Loader loading={auth.loading}>
                                        <RouteWrapper
                                            title={title}
                                            component={component}
                                            authRequirements={authRequirements}
                                        />
                                    </Loader>
                                }
                            />
                        )
                    })
                })}
            </Routes>
        </BrowserRouter>
    ) : (
        <Loader />
    )
})
