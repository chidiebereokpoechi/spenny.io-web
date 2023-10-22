import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { PrimaryButton } from '../../components/buttons'
import { WalletButton, DashboardPageWrapper, Loader } from '../../components/layout'
import { Wallet } from '../../models/response'
import { useStores } from '../../util/stores'
import { CreateWalletModal, UpdateWalletModal } from './modals'

export const WalletsPage: React.FC = observer(() => {
    const { walletsStore } = useStores()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [activeWallet, setActiveWallet] = useState<Wallet | null>(null)
    const wallets = walletsStore.wallets
    const walletsLoading = walletsStore.loading

    const openModal = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

    const clickWalletButton = useCallback((wallet: Wallet) => {
        return () => {
            setActiveWallet(wallet)
            setIsUpdateModalOpen(true)
        }
    }, [])

    useEffect(() => {
        const subscription = walletsStore.listWallets().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [walletsStore])

    return (
        <DashboardPageWrapper>
            <Loader loading={walletsLoading}>
                {activeWallet && (
                    <UpdateWalletModal
                        isOpen={isUpdateModalOpen}
                        setIsOpen={setIsUpdateModalOpen}
                        wallet={activeWallet}
                    />
                )}
                {wallets.length > 0 ? (
                    <>
                        <header className="p-4 grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Wallets</span>
                            <div>
                                <PrimaryButton type="button" onClick={openModal}>
                                    <span>Create new wallet</span>
                                </PrimaryButton>
                            </div>
                        </header>
                        <main className="p-4 flex flex-wrap overflow-y-auto">
                            {wallets.map((wallet) => (
                                <WalletButton {...wallet} key={wallet.id} onClick={clickWalletButton(wallet)} />
                            ))}
                        </main>
                    </>
                ) : (
                    <main className="p-4 flex flex-col flex-1 items-center justify-center space-y-8">
                        <div className="flex flex-col space-y-1 text-center">
                            <span className="text-xl font-bold">You have no wallets</span>
                            <span>They are helpful labels for your transactions</span>
                        </div>
                        <PrimaryButton type="button" onClick={openModal}>
                            <span>Create first wallet!</span>
                        </PrimaryButton>
                    </main>
                )}
            </Loader>
            <CreateWalletModal isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} />
        </DashboardPageWrapper>
    )
})
