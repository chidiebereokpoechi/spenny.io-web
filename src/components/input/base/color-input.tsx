import { Popover } from '@headlessui/react'
import { CirclePicker } from 'react-color'
import React, { useState } from 'react'
import { classNames } from '../../../util/misc'
import { ValidationMessage } from '../../layout'
import { HexColorPicker } from 'react-colorful'

export interface ColorInputProps {
    name: string
    className?: string
    label: string
    errors?: string[]
    placeholder?: string
    onChange?: (...args: any[]) => any
    value?: string
}

const colors: string[] = [
    '#F44E3B',
    '#D33115',
    '#9F0500',
    '#C45100',
    '#E27300',
    '#FE9200',
    '#FB9E00',
    '#FCC400',
    '#FCDC00',
    '#DBDF00',
    '#808900',
    '#B0BC00',
    '#A4DD00',
    '#333333',
    '#808080',
    '#cccccc',
    '#000000',
    '#666666',
    '#B3B3B3',
    '#4D4D4D',
    '#999999',
    '#FFFFFF',
]

export const ColorInput: React.FC<ColorInputProps> = ({ className, label, errors, onChange, value, placeholder }) => {
    const invalid = !!errors?.length
    const [isCustom, setIsCustom] = useState(false)

    return (
        <div className={classNames(className, 'grid grid-cols-1 gap-2 ring-0')}>
            {value && <label className="text-xs text-slate-500">{label}</label>}
            <Popover className="flex w-full relative">
                <Popover.Button
                    className={classNames(
                        'flex items-center w-full h-10 border-[2px] bg-slate-50 px-5 text-xs rounded-lg',
                        'outline-none focus:ring-4',
                        invalid
                            ? 'hover:border-red-900/20 focus:border-red-600 ring-red-600/20 text-red-600 placeholder:text-red-400 border-red-200'
                            : 'hover:border-primary/20 focus:border-primary ring-primary/20',
                        'border-slate-200'
                    )}
                >
                    {value && (
                        <>
                            <div
                                className="h-4 w-4 rounded-full mr-4 border-2 border-slate-200"
                                style={{
                                    background: value,
                                }}
                            />
                            <span>{value}</span>
                        </>
                    )}
                    {!value && !!placeholder && <span className="text-slate-400">{placeholder}</span>}
                </Popover.Button>
                <Popover.Panel
                    className={classNames(
                        'absolute w-full z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 p-5',
                        'flex items-center border-2 bg-slate-50 text-xs rounded-lg',
                        'outline-none justify-center'
                    )}
                >
                    {({ close }) => (
                        <>
                            {isCustom && (
                                <HexColorPicker
                                    className="!w-full"
                                    color={value}
                                    onChange={(color) => {
                                        onChange?.(color.toUpperCase())
                                    }}
                                />
                            )}
                            {!isCustom && (
                                <CirclePicker
                                    colors={colors}
                                    styles={{
                                        default: {
                                            card: {
                                                boxShadow: 'none',
                                            },
                                        },
                                    }}
                                    color={value}
                                    onChangeComplete={(color) => {
                                        onChange?.(color.hex.toUpperCase())
                                        close()
                                    }}
                                />
                            )}
                        </>
                    )}
                </Popover.Panel>
            </Popover>
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
