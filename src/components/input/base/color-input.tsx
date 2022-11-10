import { Popover } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { CirclePicker } from 'react-color'
import { HexColorPicker } from 'react-colorful'
import { usePopper } from 'react-popper'
import { Palette } from '../../../util/constants'
import { classNames } from '../../../util/misc'
import { PrimaryButton } from '../../buttons'
import { ValidationMessage } from '../../layout'

export interface ColorInputProps {
    name: string
    className?: string
    label: string
    errors?: string[]
    placeholder?: string
    colors?: string[]
    onChange?: (...args: any[]) => any
    value?: string
}

const defaultColors: string[] = [
    ...Palette.Scales,
    ...Palette.PinkFoam,
    ...Palette.BlueToRed,
    ...Palette.Slate,
    ...Palette.Primary,
]

export const ColorInput: React.FC<ColorInputProps> = ({
    className,
    label,
    errors,
    onChange,
    value,
    colors,
    placeholder,
}) => {
    const invalid = !!errors?.length
    const [isCustom, setIsCustom] = useState(false)
    const [width, setWidth] = useState(0)
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setPopperElement] = useState<any>(null)
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'top',
        strategy: 'fixed',
        modifiers: [
            {
                name: 'preventOverflow',
            },
            {
                name: 'offset',
                options: {
                    offset: [0, 8],
                },
            },
            {
                name: 'flip',
                options: {
                    padding: 8,
                },
            },
        ],
    })

    useEffect(() => {
        if (referenceElement) {
            setWidth(referenceElement.getBoundingClientRect().width)
        }
    }, [referenceElement])

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
                    ref={setReferenceElement}
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
                <Popover.Panel>
                    {({ close }) => (
                        <div
                            className={classNames(
                                'absolute z-[100] p-5',
                                'flex flex-col items-center border-2 bg-slate-50 text-xs rounded-lg space-y-8',
                                'outline-none justify-center shadow-lg'
                            )}
                            ref={setPopperElement}
                            style={{ ...styles.popper, width }}
                            {...attributes.popper}
                        >
                            <button
                                onClick={() => close()}
                                className="absolute right-2 top-2 text-slate-100 bg-slate-400 focus:bg-slate-600 hover:bg-slate-600 rounded px-4 py-1 font-bold text-[10px]"
                            >
                                <span>Close</span>
                            </button>
                            {isCustom ? (
                                <HexColorPicker
                                    className="!w-full"
                                    color={value}
                                    onChange={(color) => {
                                        onChange?.(color.toUpperCase())
                                    }}
                                />
                            ) : (
                                <CirclePicker
                                    colors={colors ?? defaultColors}
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
                                    }}
                                />
                            )}
                            <PrimaryButton
                                className="w-full"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsCustom((x) => !x)
                                }}
                            >
                                <span>{isCustom ? 'Choose from presets' : 'Use custom color'}</span>
                            </PrimaryButton>
                        </div>
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
