import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import { classNames } from '../../../util/misc'
import { ValidationMessage } from '../../layout'

export interface TextAreaInputProps extends HTMLMotionProps<'textarea'> {
    name: string
    className?: string
    label?: string
    errors?: string[]
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ className, label, errors, ...props }) => {
    const invalid = !!errors?.length

    return (
        <div className={classNames(className, 'grid grid-cols-1 gap-2 ring-0')}>
            {label && <label className="text-xs text-slate-500">{label}</label>}
            <motion.textarea
                className={classNames(
                    'h-20 min-h-[5rem] max-h-32 border-[2px] bg-slate-50 px-5 py-4 text-xs rounded-lg',
                    'outline-none focus:ring-4',
                    invalid
                        ? 'hover:border-red-900/20 focus:border-red-600 ring-red-600/20 text-red-600 placeholder:text-red-400 border-red-200'
                        : 'hover:border-primary/20 focus:border-primary ring-primary/20',
                    'placeholder:text-slate-400 border-slate-200'
                )}
                {...props}
            />
            {invalid && (
                <div className="grid grid-cols-1 gap-2">
                    {errors.map((error, i) => {
                        return <ValidationMessage message={error} type="error" key={i} />
                    })}
                </div>
            )}
        </div>
    )
}
