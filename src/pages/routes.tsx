import { AuthRequirement, RouteLink } from '../util/constants'
import { LogInPage, SignUpPage } from './auth'
import { CategoriesPage, DashboardPage } from './dashboard'

type Component = React.FC | React.LazyExoticComponent<any>
type RoutePath = RouteLink & string

export type Route = [
    RoutePath[] /* Paths for route */,
    string /* Title */,
    Component /* Component to render */,
    AuthRequirement[]
]

export const routes: Route[] = [
    [[RouteLink.Index, RouteLink.LogIn], 'Log into spenny.io', LogInPage, [AuthRequirement.Unauthenticated]],
    [[RouteLink.SignUp], 'Sign up for spenny.io', SignUpPage, [AuthRequirement.Unauthenticated]],
    [[RouteLink.Dashboard], 'Dashboard', DashboardPage, [AuthRequirement.Authenticated]],
    [[RouteLink.Categories], 'Categories', CategoriesPage, [AuthRequirement.Authenticated]],
]
