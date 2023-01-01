import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { PrimaryButton } from '../../components/buttons'
import { DashboardPageWrapper, Loader } from '../../components/layout'
import { Category, Transaction } from '../../models/response'
import useDimensions from '../../util/misc/dimensions'
import { useStores } from '../../util/stores'
import { TransactionsTable } from './components/transactions-table'
import { CreateTransactionModal, UpdateCategoryModal, UpdateTrackerModal, UpdateTransactionModal } from './modals'

export const TrackerPage: React.FC = observer(() => {
    const { id } = useParams()
    const { trackersStore, transactionsStore } = useStores()
    const [ref, dimensions] = useDimensions()
    const [isEditTrackerModalOpen, setIsEditTrackerModalOpen] = useState(false)
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false)
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false)
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
    const aggregate = transactionsStore.aggregate
    const transactions = aggregate?.transactions
    const hasTransactions = !!transactions?.length
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
                    {hasTransactions && !!aggregate ? (
                        <TransactionsTable
                            openCategory={openCategory}
                            openTransaction={openTransaction}
                            dimensions={dimensions}
                            aggregate={aggregate}
                        />
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
