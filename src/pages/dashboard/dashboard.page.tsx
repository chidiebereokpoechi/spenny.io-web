import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../../components/buttons'
import { DashboardPageWrapper, Loader } from '../../components/layout'
import { Tracker } from '../../models/response'
import { RouteLink } from '../../util/constants'
import { useStores } from '../../util/stores'
import { CreateTrackerModal } from './modals'

const TrackerButton: React.FC<Tracker> = ({ id, label, description }) => {
    return (
        <Link to={`${RouteLink.Trackers}/${id}`}>
            <motion.div
                className="bg-white rounded-lg aspect-square shadow-lg flex flex-col justify-end overflow-hidden bg-gradient-to-b from-cyan-500 to-blue-500"
                whileHover={{ scale: 1.025 }}
            >
                <div className="bg-gradient-to-b from-black/0 to-black/60 flex flex-col space-y-1 p-5">
                    <span className="text-[16px] font-bold text-white">{label}</span>
                    <span className="text-[10px] text-slate-300">{description ?? 'No description'}</span>
                </div>
            </motion.div>
        </Link>
    )
}

export const DashboardPage: React.FC = observer(() => {
    const { trackersStore } = useStores()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const trackers = trackersStore.trackers
    const trackersLoading = trackersStore.loading

    const openModal = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

    useEffect(() => {
        const subscription = trackersStore.listTrackers().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [trackersStore])

    return (
        <DashboardPageWrapper>
            <Loader loading={trackersLoading}>
                <CreateTrackerModal isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} />
                {trackers.length > 0 ? (
                    <>
                        <header className="p-8 grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Trackers</span>
                            <div>
                                <PrimaryButton type="button" onClick={openModal}>
                                    <span>Create new tracker</span>
                                </PrimaryButton>
                            </div>
                        </header>
                        <main className="p-8 grid grid-cols-5 gap-6">
                            {trackers.map((tracker) => (
                                <TrackerButton {...tracker} key={tracker.id} />
                            ))}
                        </main>
                    </>
                ) : (
                    <main className="p-8 flex flex-col flex-1 items-center justify-center space-y-8">
                        <div className="flex flex-col space-y-1 text-center">
                            <span className="text-xl font-bold">You have no trackers</span>
                            <span>You need them to start tracking transactions</span>
                        </div>
                        <PrimaryButton type="button" onClick={openModal}>
                            <span>Create first tracker!</span>
                        </PrimaryButton>
                    </main>
                )}
            </Loader>
        </DashboardPageWrapper>
    )
})
