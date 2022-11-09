import { Dialog } from '@headlessui/react'
import React, { useCallback } from 'react'
import { ModalProps } from './modal-props'

export const SideModal: React.FC<ModalProps> = ({ children, isOpen, setIsOpen, initialFocus }) => {
    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    return (
        <Dialog open={isOpen} onClose={close} className="relative z-50 isolate" initialFocus={initialFocus}>
            <div className="fixed inset-0 bg-[#030412]/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-start">
                <Dialog.Panel className="h-full overflow-y-auto w-full max-w-[28rem] bg-white px-8 py-10 scroll-py-10">
                    <button onClick={close} className="absolute right-3 top-3" />
                    <main>{children}</main>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
