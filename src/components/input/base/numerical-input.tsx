import React, { useCallback } from 'react'
import { classNames } from '../../../util/misc'
import { ValidationMessage } from '../../layout'
import NumericInput, { NumericInputProps } from 'react-numeric-input'

export interface NumericalInputProps extends Omit<NumericInputProps, 'onChange'> {
    name: string
    className?: string
    label: string
    errors?: string[]
    onChange?: (value?: number | null) => void
}

export const NumericalInput: React.FC<NumericalInputProps> = ({
    className,
    label,
    errors,
    onChange: changeFunction,
    ...props
}) => {
    const invalid = !!errors?.length

    const onChange: NumericInputProps['onChange'] = useCallback(
        (value?: number | null) => {
            changeFunction?.(value)
        },
        [changeFunction]
    )

    return (
        <div className={classNames(className, 'grid grid-cols-1 gap-2 ring-0')}>
            {!!props.value && (
                <label htmlFor={props.name} className="text-xs text-slate-500">
                    {label}
                </label>
            )}
            <NumericInput
                className={classNames(
                    'flex w-full h-10 border-[2px] bg-slate-50 px-5 text-xs rounded-lg',
                    'outline-none focus:ring-4',
                    invalid
                        ? 'hover:border-red-900/20 focus:border-red-600 ring-red-600/20 text-red-600 placeholder:text-red-400 border-red-200'
                        : 'hover:border-primary/20 focus:border-primary ring-primary/20',
                    'placeholder:text-slate-400 border-slate-200'
                )}
                noStyle
                {...props}
                onChange={onChange}
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
