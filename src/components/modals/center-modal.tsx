import { Dialog } from '@headlessui/react'
import React, { useCallback } from 'react'
import { classNames } from '../../util/misc'
import { ModalProps } from './modal-props'

interface Props extends ModalProps {
    className?: string
}

export const CenterModal: React.FC<Props> = ({ children, className, isOpen, setIsOpen, initialFocus }) => {
    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    return (
        <Dialog open={isOpen} onClose={close} className="relative z-50 isolate" initialFocus={initialFocus}>
            <div className="fixed inset-0 bg-[#030412]/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto scroll-my-5 h-screen">
                <Dialog.Panel
                    className={classNames(
                        'px-12 py-14 w-full sm:max-w-[25rem] max-h-screen overflow-y-auto bg-white rounded-xl relative shadow-lg flex flex-col',
                        className
                    )}
                >
                    <button
                        onClick={close}
                        className="absolute right-2 top-2 text-slate-100 bg-slate-400 focus:bg-slate-600 hover:bg-slate-600 rounded px-4 py-1 font-bold text-[10px]"
                    >
                        <span>Close</span>
                    </button>
                    <main>{children}</main>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
