import { observer } from 'mobx-react'
import React from 'react'
import { useStores } from '../../util/stores'

export const TopBar: React.FC = observer(() => {
    const { user } = useStores()
    const you = user.user

    return (
        <div>
            <div className="h-40 bg-slate-900 text-white flex p-8 flex-col justify-center space-y-2">
                <span className="font-bold text-3xl text-primary">Hey {you?.username}</span>
                <span className="text-slate-300">Get to tracking your recurring transactions!</span>
            </div>
        </div>
    )
})
