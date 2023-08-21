import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { every, map } from 'lodash'
import React from 'react'
import { CellProps } from 'react-table'
import { MiniCategoryButton } from '../../../components/layout'
import { BasicTable } from '../../../components/tables'
import { Category, ComputedTransaction, Transaction, TransactionAggregate } from '../../../models/response'
import { transactionStatusLabelMap, transactionTypeLabelMap } from '../../../util/constants'
import { cellValue, classNames } from '../../../util/misc'
import { DimensionObject } from '../../../util/misc/dimensions'
import { NetAmount } from './aggregate'

interface Props {
    aggregate: TransactionAggregate
    openTransaction: (transaction: Transaction) => () => void
    openCategory: (category: Category) => () => void
    dimensions?: DimensionObject
}

export const TransactionsTable: React.FC<Props> = ({ aggregate, openTransaction, openCategory, dimensions }) => {
    const transactions = aggregate.transactions

    return (
        <main className="flex-1 w-full overflow-auto relative" style={{ width: dimensions?.width }}>
            <BasicTable
                columns={[
                    {
                        Header: 'Label',
                        accessor: 'label',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const transaction = cellValue(cell)
                            const { label } = transaction

                            return (
                                <div className="flex justify-between space-x-4">
                                    <div className="flex flex-col space-y-2">
                                        <div>
                                            <button
                                                className="inline-flex justify-start py-1 px-2 bg-slate-600 rounded"
                                                onClick={openTransaction(transaction.transaction)}
                                            >
                                                <span className="font-[500] text-left text-white">{label}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                    },
                    {
                        Header: 'Type',
                        accessor: 'type',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { type } = cellValue(cell)
                            const { backgroundColor, color, text } = transactionTypeLabelMap[type]

                            return (
                                <div className="inline-flex py-1 px-2 rounded" style={{ backgroundColor }}>
                                    <span className="font-[500]" style={{ color }}>
                                        {text}
                                    </span>
                                </div>
                            )
                        },
                    },
                    {
                        Header: 'Wallet',
                        accessor: 'walletValue',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { wallet } = cellValue(cell)

                            if (!wallet) {
                                return null
                            }

                            const { background_color: backgroundColor, color, label } = wallet

                            return (
                                <div className="inline-flex py-1 px-2 rounded" style={{ backgroundColor }}>
                                    <span className="font-[500]" style={{ color }}>
                                        {label}
                                    </span>
                                </div>
                            )
                        },
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { status } = cellValue(cell)
                            const { backgroundColor, color, text } = transactionStatusLabelMap[status]

                            return (
                                <div className="inline-flex py-1 px-2 rounded" style={{ backgroundColor }}>
                                    <span className="font-[500]" style={{ color }}>
                                        {text}
                                    </span>
                                </div>
                            )
                        },
                    },
                    {
                        Header: 'Categories',
                        accessor: 'categoriesValue',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { categories } = cellValue(cell)
                            return (
                                <div className="flex flex-wrap -mb-2">
                                    {categories.map((category, i) => (
                                        <MiniCategoryButton key={i} {...category} onClick={openCategory(category)} />
                                    ))}
                                </div>
                            )
                        },
                    },
                    {
                        Header: 'Amount',
                        accessor: 'amount',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const transaction = cellValue(cell)
                            return (
                                <div className="flex justify-between">
                                    <span>£</span>
                                    <span>{transaction.amount.toFixed(2)}</span>
                                </div>
                            )
                        },
                        Footer() {
                            const [income, expenses, net] = (aggregate as TransactionAggregate).totalAmount

                            return <NetAmount {...{ income, expenses, net }} />
                        },
                    },
                    {
                        Header: 'Selected month amount',
                        accessor: 'selectedMonth',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const transaction = cellValue(cell)
                            return (
                                <div className="flex justify-between">
                                    <span>£</span>
                                    <span>{transaction.selectedMonth.toFixed(2)}</span>
                                </div>
                            )
                        },
                        Footer() {
                            const [income, expenses, net] = (aggregate as TransactionAggregate).totalSelectedMonth

                            return <NetAmount {...{ income, expenses, net }} />
                        },
                    },
                    {
                        Header: 'Recurrence',
                        accessor: 'recurrenceValue',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { recurs } = cellValue(cell)
                            return <span className="whitespace-pre">{recurs}</span>
                        },
                    },
                    {
                        Header: 'Next payment',
                        accessor: 'nextPayment',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { nextPaymentFormatted } = cellValue(cell)
                            return <span>{nextPaymentFormatted}</span>
                        },
                    },
                    {
                        Header: 'Due this month',
                        accessor: 'dueThisMonth',
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { dueThisMonth } = cellValue(cell)
                            return (
                                <div className="flex justify-between">
                                    <span>£</span>
                                    <span>{dueThisMonth.toFixed(2)}</span>
                                </div>
                            )
                        },
                        Footer() {
                            const total = aggregate?.dueThisMonth
                            return (
                                <div className="flex justify-between">
                                    <span>£</span>
                                    <span>{total?.toFixed(2)}</span>
                                </div>
                            )
                        },
                    },
                    {
                        Header: 'Paid this month',
                        accessor: (transaction: ComputedTransaction) => transaction.dueThisMonth,
                        Cell({ cell }: CellProps<ComputedTransaction>) {
                            const { paid } = cellValue(cell)
                            const Icon = paid ? CheckIcon : XMarkIcon

                            return (
                                <div className="flex justify-center">
                                    <Icon
                                        className={classNames(paid ? 'text-green-500' : 'text-red-500', 'h-4')}
                                        strokeWidth={2}
                                    />
                                </div>
                            )
                        },
                        Footer({ rows }) {
                            const paid = every(map(rows, 'original.paid'))
                            const Icon = paid ? CheckIcon : XMarkIcon

                            return (
                                <div className="flex justify-center">
                                    <Icon
                                        className={classNames(paid ? 'text-green-500' : 'text-red-500', 'h-4')}
                                        strokeWidth={2}
                                    />
                                </div>
                            )
                        },
                    },
                ]}
                data={transactions}
            />
        </main>
    )
}
