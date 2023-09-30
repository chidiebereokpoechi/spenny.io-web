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
                type === 'error' && 'text-red-800 border-red-200 bg-red-100',
                type === 'info' && 'text-slate-800 border-slate-100 bg-slate-50',
                'border-[2px] rounded px-3 py-1 font-bold'
            )}
        >
            <span>{message}</span>
        </div>
    )
}
