import { ChevronDoubleUpIcon, ChevronDoubleDownIcon, WalletIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface Props {
    income: number
    expenses: number
    net: number
}

export const NetAmount: React.FC<Props> = ({ income, expenses, net }) => {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex justify-between flex-nowrap items-center whitespace-nowrap">
                <div className="flex items-center mr-4 text-slate-500">
                    <span className="mr-2">£</span>
                    <ChevronDoubleUpIcon className="h-3 text-green-400" />
                </div>
                <span>{income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between flex-nowrap items-center whitespace-nowrap">
                <div className="flex items-center mr-4 text-slate-500">
                    <span className="mr-2">£</span>
                    <ChevronDoubleDownIcon className="h-3 text-red-500" />
                </div>
                <span>{expenses.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between flex-nowrap items-center whitespace-nowrap">
                <div className="flex items-center mr-4 text-slate-500">
                    <span className="mr-2">£</span>
                    <WalletIcon className="h-3" />
                </div>
                <span className="font-bold">{net.toFixed(2)}</span>
            </div>
        </div>
    )
}
