import React from 'react'
import { classNames } from '../../util/misc'

interface Props {
    message: string
    type: 'info' | 'error'
}

export const ValidationMessage: React.FC<Props> = ({ message, type }) => {
    return (
        <div
            className={classNames(
                type === 'error' && 'text-red-800 bg-red-50',
                type === 'info' && 'text-slate-800 bg-slate-50',
                'bg-slate-50 rounded px-4 py-1.5 font-bold'
            )}
        >
            <span>{message}</span>
        </div>
    )
}
