import { AuthRequirement, RouteLink } from '../util/constants'
import { LogInPage, SignUpPage } from './auth'

type Component = React.FC | React.LazyExoticComponent<any>
type RoutePath = RouteLink & string

export type Route = [
    RoutePath[] /* Paths for route */,
    string /* Title */,
    Component /* Component to render */,
    AuthRequirement[]
]

export const routes: Route[] = [
    [[RouteLink.INDEX, RouteLink.LOG_IN], 'Log into spenny.io', LogInPage, [AuthRequirement.UNAUTHENTICATED]],
    [[RouteLink.SIGN_UP], 'Sign up for spenny.io', SignUpPage, [AuthRequirement.UNAUTHENTICATED]],
]
