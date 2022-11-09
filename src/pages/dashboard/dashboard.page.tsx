import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { PrimaryButton } from '../../components/buttons'
import { DashboardPageWrapper } from '../../components/layout'
import { Tracker } from '../../models/response'
import { useStores } from '../../util/stores'

const TrackerButton: React.FC<Tracker> = ({ label, description }) => {
    return (
        <motion.div
            className="bg-white rounded-lg aspect-square shadow-lg flex flex-col justify-end overflow-hidden bg-gradient-to-b from-cyan-500 to-blue-500"
            whileHover={{ scale: 1.025 }}
        >
            <div className="bg-gradient-to-b from-black/0 to-black/60 flex flex-col space-y-1 p-5">
                <span className="text-[16px] font-bold text-white">{label}</span>
                <span className="text-[10px] text-slate-300">{description ?? 'No description'}</span>
            </div>
        </motion.div>
    )
}

export const DashboardPage: React.FC = observer(() => {
    const { user, trackers: trackersStore } = useStores()
    const trackers = trackersStore.trackers

    useEffect(() => {
        const subscription = trackersStore.listTrackers().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [trackersStore])

    return (
        <DashboardPageWrapper>
            <header className="p-8 grid grid-cols-1 gap-4">
                <span className="text-3xl font-extrabold text-black">Trackers</span>
                <div>
                    <PrimaryButton type="button">
                        <span>Create new tracker</span>
                    </PrimaryButton>
                </div>
            </header>
            <main className="p-8 grid grid-cols-5 gap-6">
                {trackers.map((tracker) => (
                    <TrackerButton {...tracker} key={tracker.id} />
                ))}
            </main>
        </DashboardPageWrapper>
    )
})
