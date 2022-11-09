import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { PrimaryButton } from '../../components/buttons'
import { DashboardPageWrapper } from '../../components/layout'
import { UpdateTrackerModel } from '../../models/request'
import { useStores } from '../../util/stores'
import { CreateTransactionModal, UpdateTrackerModal } from './modals'

export const TrackerPage: React.FC = observer(() => {
    const { id } = useParams()
    const { trackersStore, transactionsStore } = useStores()
    const [isEditTrackerModalOpen, setIsEditTrackerModalOpen] = useState(false)
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false)
    const transactions = transactionsStore.transactions
    const hasTransactions = transactions.length > 0
    const activeTracker = trackersStore.activeTracker

    const openEditTrackerModal = useCallback(() => {
        setIsEditTrackerModalOpen(true)
    }, [])

    const openCreateTransactionModal = useCallback(() => {
        setIsCreateTransactionModalOpen(true)
    }, [])

    useEffect(() => {
        const subscription = trackersStore.retrieveTracker(+id!).subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [trackersStore, id, activeTracker])

    useEffect(() => {
        if (trackersStore.ready && activeTracker) {
            const subscription = transactionsStore.listTransactionsForTracker(activeTracker.id).subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [trackersStore.ready, activeTracker, transactionsStore])

    return activeTracker ? (
        <DashboardPageWrapper>
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
                </>
            )}
            <header className="p-8 grid grid-cols-1 gap-4">
                <span className="text-3xl font-extrabold text-black">{activeTracker.label}</span>
                <div className="space-x-4">
                    <PrimaryButton type="button" onClick={openEditTrackerModal}>
                        <span>Edit tracker details</span>
                    </PrimaryButton>
                    {hasTransactions && (
                        <PrimaryButton type="button" onClick={openCreateTransactionModal}>
                            <span>Create transaction</span>
                        </PrimaryButton>
                    )}
                </div>
            </header>
            {hasTransactions ? (
                <main className="p-8 grid grid-cols-5 gap-6">
                    <span>Hoooooooo</span>
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
