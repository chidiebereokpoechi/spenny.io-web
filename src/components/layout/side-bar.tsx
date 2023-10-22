import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { RouteLink } from '../../util/constants'
import { classNames } from '../../util/misc'
import { useStores } from '../../util/stores'

interface SideBarLinkProps {
    link: string
    label: string
    onClick?: (...args: any[]) => any
}

const SideBarLink: React.FC<SideBarLinkProps> = ({ link, label, onClick }) => {
    const active = useMatch(link)
    return (
        <Link
            to={link}
            className={classNames(
                'flex items-center justify-center px-2 py-2 rounded-lg',
                active
                    ? 'bg-slate-900 text-white ring-4 ring-primary'
                    : 'bg-slate-50 text-slate-400 border-2 border-slate-200 hover:bg-slate-200 focus:bg-slate-200 ring-primary-dark'
            )}
            onClick={onClick}
        >
            <span>{label}</span>
        </Link>
    )
}

export const SideBar: React.FC = observer(() => {
    const { authStore: auth } = useStores()

    const signOut = useCallback(
        (e: any) => {
            e.preventDefault()
            auth.signOut()
        },
        [auth]
    )

    return (
        <aside className="bg-slate-50 w-40 flex flex-col justify-between">
            <nav className="flex flex-col space-y-4 p-4">
                <SideBarLink link={RouteLink.Dashboard} label="Dashboard" />
                <SideBarLink link={RouteLink.Categories} label="Categories" />
                <SideBarLink link={RouteLink.Wallets} label="Wallets" />
            </nav>
            <nav className="flex flex-col space-y-4 p-4">
                {/* <SideBarLink link={RouteLink.Profile} label="Profile" /> */}
                <SideBarLink link="#" label="Sign out" onClick={signOut} />
            </nav>
        </aside>
    )
})
