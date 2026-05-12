import React from 'react'
import { SideBar } from './side-bar'

interface Props {
    children: React.ReactNode | React.ReactNode[]
}

export const DashboardPageWrapper: React.FC<Props> = ({ children }) => {
    return (
        <div className="h-screen w-screen bg-slate-100 flex flex-col">
            <div className="flex flex-1 divide-x-2 divide-slate-200 overflow-hidden">
                <SideBar />
                <main className="flex flex-col flex-1">{children}</main>
            </div>
        </div>
    )
}
