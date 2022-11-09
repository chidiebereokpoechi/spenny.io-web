import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthRequirement, RouteLink } from '../../util/constants'
import { stores } from '../../util/stores'

interface Props {
    title: string
    component: React.FC
    authRequirements: AuthRequirement[]
}

type AuthRequirementResponse = [boolean, RouteLink]

export const AUTH_REQUIREMENTS: Record<AuthRequirement, () => AuthRequirementResponse> = {
    [AuthRequirement.AUTHENTICATED]() {
        return [stores.auth.authenticated, RouteLink.LOG_IN] as AuthRequirementResponse
    },
    [AuthRequirement.UNAUTHENTICATED]() {
        return [!stores.auth.authenticated, RouteLink.DASHBOARD]
    },
}

export const RouteWrapper: React.FC<Props> = observer(({ title, component: Component, authRequirements }) => {
    for (const requirement of authRequirements) {
        const [verified, route] = AUTH_REQUIREMENTS[requirement]()

        if (!verified) {
            return <Navigate to={route /* Link to correct page */} replace={true} />
        }
    }

    useEffect(() => {
        document.title = title
    }, [title])

    return (
        <>
            <Component />
        </>
    )
})
