import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { isArray } from 'lodash'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { Category } from '../../../models/response'
import { CreateCategoryModal } from '../../../pages/dashboard/modals'
import { classNames } from '../../../util/misc'
import { useStores } from '../../../util/stores'
import { PrimaryButton } from '../../buttons'
import { MiniCategoryButton, ValidationMessage } from '../../layout'

export interface CategoriesSelectInputProps {
    name: string
    className?: string
    label: string
    errors?: string[]
    placeholder?: string
    onChange?: (...args: any[]) => any
    onBlur?: (...args: any[]) => any
    value?: number[]
    createCategory?: (...args: any[]) => any
}

const Input: React.FC<CategoriesSelectInputProps> = ({
    name,
    className,
    label,
    errors,
    placeholder,
    onChange,
    value,
    createCategory,
}) => {
    const [isCreateCategoriesModalOpen, setIsCreateCategoriesModalOpen] = useState(false)
    const { categoriesStore } = useStores()
    const categories = categoriesStore.categories
    const invalid = !!errors?.length
    const showPlaceholder = !value || (isArray(value) && value.length === 0)
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

    const categoriesMap = useMemo(() => {
        const map: Record<number, Category> = {}

        for (const category of categories) {
            map[category.id] = category
        }

        return map
    }, [categories])

    const select = useCallback(
        (selected?: number[]) => {
            return onChange?.(selected)
        },
        [onChange]
    )

    const openCreateCategoriesModal = useCallback(() => {
        setIsCreateCategoriesModalOpen(true)
    }, [])

    const addToSelection = useCallback(
        (category: Category) => {
            select(value?.concat(category.id))
        },
        [select, value]
    )

    useEffect(() => {
        if (referenceElement) {
            setWidth(referenceElement.getBoundingClientRect().width)
        }
    }, [referenceElement])

    return (
        <>
            <CreateCategoryModal isOpen={isCreateCategoriesModalOpen} setIsOpen={setIsCreateCategoriesModalOpen} />
            <div className={classNames(className, 'grid grid-cols-1 gap-2 ring-0')}>
                <div className="flex justify-between">
                    {showPlaceholder ? (
                        <label />
                    ) : (
                        <label htmlFor={name} className="text-xs text-slate-500">
                            {label}
                        </label>
                    )}
                    <button
                        className={classNames(
                            'bg-slate-200 text-slate-500 px-1 text-[10px] rounded',
                            'hover:bg-slate-300'
                        )}
                        onClick={openCreateCategoriesModal}
                        type="button"
                    >
                        <span>Create category</span>
                    </button>
                </div>
                <Listbox value={value} onChange={select} multiple name={name} as="div" className="flex w-full relative">
                    <Listbox.Button
                        className={classNames(
                            'flex items-center w-full py-2.5 border-[2px] bg-slate-50 px-5 text-xs rounded-lg',
                            'outline-none focus:ring-4 cursor-pointer',
                            invalid
                                ? 'hover:border-red-900/20 focus:border-red-600 ring-red-600/20 text-red-600 placeholder:text-red-400 border-red-200'
                                : 'hover:border-primary/20 focus:border-primary ring-primary/20',
                            'placeholder:text-slate-400 border-slate-200 overflow-x-hidden'
                        )}
                        as="div"
                        ref={setReferenceElement}
                    >
                        {showPlaceholder ? (
                            <span className="text-slate-400">{placeholder}</span>
                        ) : (
                            <div className="flex flex-wrap -mx-2 -mb-2">
                                {(value as any[]).map((selection) => (
                                    <MiniCategoryButton {...categoriesMap[selection]} key={selection} />
                                ))}
                            </div>
                        )}
                    </Listbox.Button>
                    <Listbox.Options
                        className={classNames(
                            'absolute w-full z-10 bottom-full left-0 transform -translate-y-2 overflow-hidden',
                            'grid grid-cols-1 items-center border-2 bg-slate-50 text-xs rounded-lg',
                            'outline-none justify-center shadow-lg divide-y-2 divide-slate-100 !ring-0'
                        )}
                        ref={setPopperElement}
                        style={{ ...styles.popper, width }}
                        {...attributes.popper}
                    >
                        {categories.length === 0 ? (
                            <div className="p-3 flex flex-col space-y-2 items-center">
                                <span>You have no categories</span>
                                <PrimaryButton className="w-full">
                                    <span>Create your first category!</span>
                                </PrimaryButton>
                            </div>
                        ) : (
                            categories.map((category) => (
                                <Listbox.Option as={React.Fragment} key={category.id} value={category.id}>
                                    {({ active, selected, disabled }) => (
                                        <li
                                            className={classNames(
                                                disabled && 'cursor-not-allowed pointer-events-none text-slate-300',
                                                active && (selected ? 'bg-primary-dark' : 'bg-slate-200'),
                                                selected &&
                                                    'bg-primary text-white focus:bg-primary-dark active:bg-primary-dark hover:!bg-primary-dark',
                                                'cursor-pointer h-10 w-full px-5 py-1 flex items-center ring-inset !ring-0 hover:bg-slate-100'
                                            )}
                                        >
                                            {selected && <CheckIcon className="h-3 mr-2" strokeWidth={2} />}
                                            <span>{category.label}</span>
                                        </li>
                                    )}
                                </Listbox.Option>
                            ))
                        )}
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
        </>
    )
}

export const CategoriesSelectInput = observer(Input)
