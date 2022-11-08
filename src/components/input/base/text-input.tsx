import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import { classNames } from '../../../util/misc'
import { ValidationMessage } from '../../layout'

interface Props extends HTMLMotionProps<'input'> {
    name: string
    className?: string
    label?: string
    errors?: string[]
}

export const TextInput: React.FC<Props> = ({ className, name, label, placeholder, errors }) => {
    return (
        <div className={classNames(className, 'grid grid-cols-1 gap-2 ring-0')}>
            {label && <label className="text-xs text-slate-500">{label}</label>}
            <motion.input
                className={classNames(
                    'h-10 border-[2px] border-slate-50 bg-slate-50 px-4 text-xs rounded-lg',
                    'outline-none focus:ring-4 ring-primary/20',
                    'hover:border-primary/20 focus:border-primary',
                    'placeholder:text-slate-400'
                )}
                name={name}
                placeholder={placeholder}
            />
            {errors && (
                <div className="grid grid-cols-1 gap-2">
                    {errors.map((error, i) => {
                        return <ValidationMessage message={error} type="error" key={i} />
                    })}
                </div>
            )}
        </div>
    )
}
