import { HTMLMotionProps, motion } from 'framer-motion'
import { forwardRef } from 'react'
import { classNames } from '../../util/misc'

interface Props extends HTMLMotionProps<'button'> {
    loading?: boolean
}

export const PrimaryButton = forwardRef<any, Props>(({ loading, children, className, onClick, ...props }, ref) => {
    return (
        <motion.button
            className={classNames(
                'rounded-lg',
                'bg-primary active:bg-primary-dark disabled:bg-[#e7e7eb]',
                'text-white text-xs w-full font-bold',
                'outline-none focus:ring-4 ring-primary/20',
                'h-10',
                'px-4',
                className
            )}
            onClick={loading ? (e) => e.preventDefault() : onClick}
            {...props}
            ref={ref}
        >
            {loading ? <span>Loading</span> : children}
        </motion.button>
    )
})
