import { MutableRefObject } from 'react'

export interface ModalProps {
    children?: React.ReactNode
    isOpen: boolean
    setIsOpen: (value: boolean) => any
    initialFocus?: MutableRefObject<any>
}
