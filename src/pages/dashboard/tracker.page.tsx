import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { PrimaryButton } from '../../components/buttons'
import { DateInput, SelectInput } from '../../components/input'
import { DashboardPageWrapper, Loader } from '../../components/layout'
import { DomainTransaction } from '../../domain'
import { Category } from '../../models/response'
import useDimensions from '../../util/misc/dimensions'
import { useStores } from '../../util/stores'
import { TransactionsTable } from './components/transactions-table'
import { CreateTransactionModal, UpdateCategoryModal, UpdateTrackerModal, UpdateTransactionModal } from './modals'

export const TrackerPage: React.FC = observer(() => {
    const { id } = useParams()
    const { trackersStore, transactionsStore, walletsStore } = useStores()
    const [ref, dimensions] = useDimensions()
    const [isEditTrackerModalOpen, setIsEditTrackerModalOpen] = useState(false)
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false)
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false)
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
    const aggregate = transactionsStore.aggregate
    const transactions = aggregate?.transactions
    const hasTransactions = !!transactions?.length
    const wallets = walletsStore.wallets
    const selectedWallets = transactionsStore.wallets
    const activeTracker = trackersStore.activeTracker
    const trackersLoading = trackersStore.loading
    const transactionsLoading = transactionsStore.loading
    const ready = trackersStore.ready
    const date = transactionsStore.date
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)
    const [activeTransaction, setActiveTransaction] = useState<DomainTransaction | null>(null)

    const openEditTrackerModal = useCallback(() => {
        setIsEditTrackerModalOpen(true)
    }, [])

    const openCreateTransactionModal = useCallback(() => {
        setIsCreateTransactionModalOpen(true)
    }, [])

    const openCategory = (category: Category) => {
        return () => {
            setActiveCategory(category)
            setIsEditCategoryModalOpen(true)
        }
    }

    const openTransaction = (transaction: DomainTransaction) => {
        return () => {
            setActiveTransaction(transaction)
            setIsEditTransactionModalOpen(true)
        }
    }

    const excludeTransaction = (transaction: DomainTransaction, excluded: boolean) => {
        return () => {
            transactionsStore.setTransactionExclusion(transaction, excluded)
        }
    }

    const selectDate = (date: Date) => {
        transactionsStore.setDate(date)
    }

    const selectWallets = (wallets: number[]) => {
        transactionsStore.setWallets(wallets)
    }

    useEffect(() => {
        const subscription = trackersStore.retrieveTracker(+id!).subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [trackersStore, id])

    useEffect(() => {
        const subscription = walletsStore.listWallets().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [walletsStore])

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
                <header className="p-6 grid grid-cols-1 gap-4" ref={ref}>
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
                    <div className="flex space-x-4">
                        <div className="w-[300px]">
                            <DateInput
                                label="Select date"
                                name="date"
                                allowFutureDates
                                value={date}
                                onChange={selectDate}
                            />
                        </div>
                        <div className="w-[300px]">
                            <SelectInput
                                name="wallets"
                                label="Filter by wallets"
                                placeholder="Select wallets"
                                multiple
                                disableHideLabel
                                options={wallets}
                                accessor={{ display: 'label', value: 'id' }}
                                onChange={selectWallets}
                                value={selectedWallets}
                            />
                        </div>
                    </div>
                </header>
                <Loader loading={transactionsLoading}>
                    {hasTransactions && !!aggregate ? (
                        <TransactionsTable
                            openCategory={openCategory}
                            openTransaction={openTransaction}
                            setExclusion={excludeTransaction}
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
