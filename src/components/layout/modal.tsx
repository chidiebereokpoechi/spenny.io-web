import React from 'react'
import { Dialog } from '@headlessui/react'

export interface ModalProps {
    isOpen: boolean
    setIsOpen: (x: boolean) => any
    children?: React.ReactNode | React.ReactNode[]
}

type Props = ModalProps

export const Modal: React.FC<Props> = ({ isOpen, setIsOpen, children }) => {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <Dialog.Panel>
                <Dialog.Title>Deactivate account</Dialog.Title>
                <Dialog.Description>This will permanently deactivate your account</Dialog.Description>

                {children}

                <button onClick={() => setIsOpen(false)}>Deactivate</button>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
            </Dialog.Panel>
        </Dialog>
    )
}
