import { Listbox } from '@headlessui/react'
import { isArray } from 'lodash'
import { useCallback, useMemo } from 'react'
import { classNames } from '../../../util/misc'
import { ValidationMessage } from '../../layout'

export interface SelectInputProps<T> {
    name: string
    className?: string
    label: string
    errors?: string[]
    placeholder?: string
    onChange?: (...args: any[]) => any
    onBlur?: (...args: any[]) => any
    value?: any | any[]
    multiple?: boolean
    options: T[]
    accessor: {
        display: keyof T
        value: keyof T
    }
}

export const SelectInput = <T,>({
    name,
    className,
    label,
    errors,
    placeholder,
    onChange,
    onBlur,
    value,
    multiple,
    options: optionTypes,
    accessor,
}: React.PropsWithChildren<SelectInputProps<T>>) => {
    const invalid = !!errors?.length
    const showPlaceholder = !value || (isArray(value) && value.length === 0)

    const options = useMemo(() => {
        return optionTypes.map((option) => ({
            label: option[accessor.display] as string,
            value: option[accessor.value] as any,
        }))
    }, [accessor, optionTypes])

    const optionsMap = useMemo(() => {
        const map: Record<string, typeof options[number]> = {}

        options.forEach((option) => {
            map[option.value as unknown as string] = option
        })

        return map
    }, [options])

    const select = useCallback(
        (selected: any) => {
            return onChange?.(selected)
        },
        [onChange]
    )

    return (
        <div className={classNames(className, 'grid grid-cols-1 gap-2 ring-0')}>
            {!showPlaceholder && (
                <label htmlFor={name} className="text-xs text-slate-500">
                    {label}
                </label>
            )}
            <Listbox
                value={value}
                onChange={select}
                multiple={multiple}
                name={name}
                as="div"
                className="flex w-full relative"
            >
                <Listbox.Button
                    className={classNames(
                        'flex items-center w-full py-2.5 border-[2px] bg-slate-50 px-5 text-xs rounded-lg',
                        'outline-none focus:ring-4',
                        invalid
                            ? 'hover:border-red-900/20 focus:border-red-600 ring-red-600/20 text-red-600 placeholder:text-red-400 border-red-200'
                            : 'hover:border-primary/20 focus:border-primary ring-primary/20',
                        'placeholder:text-slate-400 border-slate-200 overflow-x-hidden'
                    )}
                    type="button"
                >
                    {showPlaceholder && <span className="text-slate-400">{placeholder}</span>}
                    {!showPlaceholder && multiple && (
                        <div className="flex flex-wrap -mx-2">
                            {(value as any[]).map((selection, i) => (
                                <span className="bg-slate-200 py-1 px-2 rounded shadow-sm mr-2 mb-2" key={i}>
                                    {optionsMap[selection].label}
                                </span>
                            ))}
                        </div>
                    )}
                    {!showPlaceholder && !multiple && <span>{optionsMap[value].label}</span>}
                </Listbox.Button>
                <Listbox.Options
                    className={classNames(
                        'absolute w-full z-10 bottom-full left-0 transform -translate-y-2 overflow-hidden',
                        'grid grid-cols-1 items-center border-2 bg-slate-50 text-xs rounded-lg',
                        'outline-none justify-center shadow-lg divide-y-2 divide-slate-100 !ring-0'
                    )}
                    as="div"
                >
                    {options.map((option) => (
                        <Listbox.Option
                            className="h-10 w-full px-5 py-1 flex items-center ring-inset focus:bg-slate-200 !ring-0 active:bg-slate-200 hover:bg-slate-100"
                            key={option.value}
                            value={option.value}
                            as="button"
                            type="button"
                        >
                            <span>{option.label}</span>
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
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
