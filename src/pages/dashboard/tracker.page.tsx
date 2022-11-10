import { PencilIcon, PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { CellProps } from 'react-table'
import { PrimaryButton } from '../../components/buttons'
import { DashboardPageWrapper, MiniCategoryButton } from '../../components/layout'
import { BasicTable } from '../../components/tables'
import { Category, Transaction } from '../../models/response'
import { cellValue } from '../../util/misc'
import { useStores } from '../../util/stores'
import { CreateTransactionModal, UpdateCategoryModal, UpdateTrackerModal, UpdateTransactionModal } from './modals'

export const TrackerPage: React.FC = observer(() => {
    const { id } = useParams()
    const { trackersStore, transactionsStore } = useStores()
    const [isEditTrackerModalOpen, setIsEditTrackerModalOpen] = useState(false)
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false)
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false)
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
    const transactions = transactionsStore.transactions
    const hasTransactions = transactions.length > 0
    const activeTracker = trackersStore.activeTracker
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

    return activeTracker ? (
        <DashboardPageWrapper>
            {activeCategory && (
                <UpdateCategoryModal
                    isOpen={isEditCategoryModalOpen}
                    setIsOpen={setIsEditCategoryModalOpen}
                    category={activeCategory}
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
            <header className="p-8 grid grid-cols-1 gap-4">
                <span className="text-3xl font-extrabold text-black">{activeTracker.label}</span>
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
            {hasTransactions ? (
                <main className="">
                    <BasicTable
                        columns={[
                            {
                                Header: 'Label',
                                accessor: 'label',
                                Cell({ cell }: CellProps<Transaction>) {
                                    const transaction = cellValue(cell)
                                    const { label, description } = transaction

                                    return (
                                        <div className="flex justify-between space-x-4">
                                            <div className="flex flex-col space-y-2">
                                                <div>
                                                    <button
                                                        className="inline-flex py-1 px-2 bg-slate-600 rounded"
                                                        onClick={openTransaction(transaction)}
                                                    >
                                                        <span className="font-[500] text-white">{label}</span>
                                                    </button>
                                                </div>
                                                {description && <span>{description}</span>}
                                            </div>
                                        </div>
                                    )
                                },
                            },
                            {
                                Header: 'Type',
                                accessor: 'type',
                            },
                            {
                                Header: 'Amount',
                                accessor: 'amount',
                                Cell({ cell }: CellProps<Transaction>) {
                                    const transaction = cellValue(cell)
                                    return (
                                        <div className="flex justify-between">
                                            <span>£</span>
                                            <span>{transaction.amount}</span>
                                        </div>
                                    )
                                },
                            },
                            {
                                Header: 'Categories',
                                Cell({ cell }: CellProps<Transaction>) {
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
                                Header: 'Date',
                                accessor: 'date',
                            },
                            {
                                Header: 'Every',
                                accessor: 'every',
                            },
                            {
                                Header: 'Time unit',
                                accessor: 'recurrence_unit',
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
        </DashboardPageWrapper>
    ) : null
})
