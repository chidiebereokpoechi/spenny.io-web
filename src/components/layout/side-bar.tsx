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
                'h-12 flex items-center justify-start px-5 rounded-lg',
                active ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 border-2 border-slate-200'
            )}
            onClick={onClick}
        >
            <span>{label}</span>
        </Link>
    )
}

export const SideBar: React.FC = observer(() => {
    const { auth } = useStores()

    const signOut = useCallback(
        (e: any) => {
            e.preventDefault()
            auth.signOut()
        },
        [auth]
    )

    return (
        <aside className="bg-slate-50 w-80 flex flex-col justify-between">
            <nav className="flex flex-col space-y-4 p-8">
                <SideBarLink link={RouteLink.DASHBOARD} label="Dashboard" />
                <SideBarLink link={RouteLink.CATEGORIES} label="Categories" />
            </nav>
            <nav className="flex flex-col space-y-4 p-8">
                <SideBarLink link={RouteLink.PROFILE} label="Profile" />
                <SideBarLink link="#" label="Sign out" onClick={signOut} />
            </nav>
        </aside>
    )
})
