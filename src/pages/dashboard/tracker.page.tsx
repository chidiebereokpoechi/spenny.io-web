import { PencilIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { every, map, sum } from 'lodash'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CellProps } from 'react-table'
import { PrimaryButton } from '../../components/buttons'
import { DashboardPageWrapper, Loader, MiniCategoryButton } from '../../components/layout'
import { BasicTable } from '../../components/tables'
import { Category, ComputedTransaction, Transaction } from '../../models/response'
import { transactionTypeLabelMap } from '../../util/constants'
import { cellValue, classNames } from '../../util/misc'
import useDimensions from '../../util/misc/dimensions'
import { useStores } from '../../util/stores'
import { CreateTransactionModal, UpdateCategoryModal, UpdateTrackerModal, UpdateTransactionModal } from './modals'

export const TrackerPage: React.FC = observer(() => {
    const { id } = useParams()
    const { trackersStore, transactionsStore } = useStores()
    const [ref, dimensions] = useDimensions()
    const [isEditTrackerModalOpen, setIsEditTrackerModalOpen] = useState(false)
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false)
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false)
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
    const transactions = transactionsStore.computedTransactions
    const hasTransactions = transactions.length > 0
    const activeTracker = trackersStore.activeTracker
    const trackersLoading = trackersStore.loading
    const transactionsLoading = transactionsStore.loading
    const ready = trackersStore.ready
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)
    const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null)

    const openEditTrackerModal = useCallback(() => {
        setIsEditTrackerModalOpen(true)
    }, [])

    const openCreateTransactionModal = useCallback(() => {
        setIsCreateTransactionModalOpen(true)
    }, [])

    const openCategory = useCallback((category: Category) => {
        return () => {
            setActiveCategory(category)
            setIsEditCategoryModalOpen(true)
        }
    }, [])

    const openTransaction = useCallback((transaction: Transaction) => {
        return () => {
            setActiveTransaction(transaction)
            setIsEditTransactionModalOpen(true)
        }
    }, [])

    useEffect(() => {
        const subscription = trackersStore.retrieveTracker(+id!).subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [trackersStore, id])

    useEffect(() => {
        if (ready && activeTracker) {
            const subscription = transactionsStore.listTransactionsForTracker(activeTracker.id).subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [ready, activeTracker, transactionsStore])

    return (
        <DashboardPageWrapper>
            {activeCategory && (
                <UpdateCategoryModal
                    isOpen={isEditCategoryModalOpen}
                    setIsOpen={setIsEditCategoryModalOpen}
                    category={activeCategory}
                    onSave={() => {
                        transactionsStore.listTransactionsForTracker(activeTracker!.id).subscribe()
                    }}
                />
            )}
            {activeTracker && (
                <>
                    <UpdateTrackerModal
                        isOpen={isEditTrackerModalOpen}
                        setIsOpen={setIsEditTrackerModalOpen}
                        tracker={activeTracker}
                    />
                    <CreateTransactionModal
                        isOpen={isCreateTransactionModalOpen}
                        setIsOpen={setIsCreateTransactionModalOpen}
                        tracker={activeTracker}
                    />
                    {activeTransaction && (
                        <UpdateTransactionModal
                            isOpen={isEditTransactionModalOpen}
                            setIsOpen={setIsEditTransactionModalOpen}
                            tracker={activeTracker}
                            transaction={activeTransaction}
                        />
                    )}
                </>
            )}
            <Loader loading={trackersLoading}>
                <header className="p-8 grid grid-cols-1 gap-4" ref={ref}>
                    <span className="text-3xl font-extrabold text-black">{activeTracker?.label}</span>
                    <div className="flex justify-between space-x-4">
                        <PrimaryButton type="button" onClick={openEditTrackerModal}>
                            <PencilIcon className="h-3" strokeWidth={2} />
                            <span>Edit tracker details</span>
                        </PrimaryButton>
                        {hasTransactions && (
                            <PrimaryButton type="button" onClick={openCreateTransactionModal}>
                                <PlusIcon className="h-3" strokeWidth={2} />
                                <span>Create transaction</span>
                            </PrimaryButton>
                        )}
                    </div>
                </header>
                <Loader loading={transactionsLoading}>
                    {hasTransactions ? (
                        <main
                            className="flex-1 w-full overflow-auto px-8 pb-8 relative"
                            style={{ width: dimensions.width }}
                        >
                            <BasicTable
                                columns={[
                                    {
                                        Header: 'Label',
                                        accessor: 'label',
                                        Cell({ cell }: CellProps<ComputedTransaction>) {
                                            const transaction = cellValue(cell)
                                            const { label, description } = transaction

                                            return (
                                                <div className="flex justify-between space-x-4">
                                                    <div className="flex flex-col space-y-2">
                                                        <div>
                                                            <button
                                                                className="inline-flex py-1 px-2 bg-slate-600 rounded"
                                                                onClick={openTransaction(transaction.transaction)}
                                                            >
                                                                <span className="font-[500] text-white">{label}</span>
                                                            </button>
                                                        </div>
                                                        {description && (
                                                            <span className="whitespace-pre-wrap">{description}</span>
                                                        )}
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
                                                <div
                                                    className="inline-flex py-1 px-2 rounded"
                                                    style={{ backgroundColor }}
                                                >
                                                    <span className="font-[500]" style={{ color }}>
                                                        {text}
                                                    </span>
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
                                        Footer({ rows }) {
                                            const total = sum(map(rows, 'original.amount'))
                                            return (
                                                <div className="flex justify-between">
                                                    <span>£</span>
                                                    <span>{total.toFixed(2)}</span>
                                                </div>
                                            )
                                        },
                                    },
                                    {
                                        Header: 'Categories',
                                        Cell({ cell }: CellProps<ComputedTransaction>) {
                                            const { categories } = cellValue(cell)
                                            return (
                                                <div className="flex flex-wrap -mb-2">
                                                    {categories.map((category, i) => (
                                                        <MiniCategoryButton
                                                            key={i}
                                                            {...category}
                                                            onClick={openCategory(category)}
                                                        />
                                                    ))}
                                                </div>
                                            )
                                        },
                                    },
                                    {
                                        Header: 'Purchase date',
                                        accessor: 'date',
                                        Cell({ cell }: CellProps<ComputedTransaction>) {
                                            const { date } = cellValue(cell)
                                            return <span>{DateTime.fromISO(date).toFormat('dd MMMM yyyy')}</span>
                                        },
                                    },
                                    {
                                        Header: 'Recurrence',
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
                                        Footer({ rows }) {
                                            const total = sum(map(rows, 'original.dueThisMonth'))
                                            return (
                                                <div className="flex justify-between">
                                                    <span>£</span>
                                                    <span>{total.toFixed(2)}</span>
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
                                                        className={classNames(
                                                            paid ? 'text-green-500' : 'text-red-500',
                                                            'h-4'
                                                        )}
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
                                                        className={classNames(
                                                            paid ? 'text-green-500' : 'text-red-500',
                                                            'h-4'
                                                        )}
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
                    ) : (
                        <main className="p-8 flex flex-col flex-1 items-center justify-center space-y-8">
                            <div className="flex flex-col space-y-1 text-center">
                                <span className="text-xl font-bold">You have no transactions</span>
                                <span>Start tracking them now</span>
                            </div>
                            <PrimaryButton type="button" onClick={openCreateTransactionModal}>
                                <span>Create first transaction!</span>
                            </PrimaryButton>
                        </main>
                    )}
                </Loader>
            </Loader>
        </DashboardPageWrapper>
    )
})
