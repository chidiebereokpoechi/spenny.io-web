import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HTMLMotionProps } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DatePicker, { CalendarContainer, ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatMonthYear, formatWeekDay } from '../../../util/formatting'
import { classNames } from '../../../util/misc'
import useDimensions from '../../../util/misc/dimensions'
import { PrimaryButton } from '../../buttons'
import { ValidationMessage } from '../../layout'

export interface DateInputProps {
    name: string
    className?: string
    label: string
    errors?: string[]
    placeholder?: string
    onChange?: (...args: any[]) => any
    value?: Date
}

const CustomHeader: React.FC<ReactDatePickerCustomHeaderProps> = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}) => (
    <div className="flex justify-between items-center px-5 mb-4">
        <PrimaryButton
            className="!h-6 !py-0 !px-2 justify-center items-center inline-flex"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            type="button"
        >
            <ChevronLeftIcon className="h-3" strokeWidth={2} />
        </PrimaryButton>
        <span className="text-xs text-slate-700">{formatMonthYear(date)}</span>
        <PrimaryButton
            className="!h-6 !py-0 !px-2 justify-center items-center inline-flex"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            type="button"
        >
            <ChevronRightIcon className="h-3" strokeWidth={2} />
        </PrimaryButton>
    </div>
)

export const DateInput: React.FC<DateInputProps> = ({ className, label, errors, onChange, value, placeholder }) => {
    const invalid = !!errors?.length
    const [ref, dimensions] = useDimensions()
    const [width, setWidth] = useState(dimensions.width)

    useEffect(() => {
        setWidth(dimensions.width)
    }, [dimensions])

    const Container: React.FC<HTMLMotionProps<'div'>> = useMemo(
        () =>
            ({ className, children }) => {
                return (
                    <div
                        style={{ width }}
                        className={classNames(
                            'flex flex-col items-center border-2 bg-slate-50 text-xs rounded-lg space-y-8',
                            'outline-none justify-center shadow-lg'
                        )}
                    >
                        <CalendarContainer className={className}>
                            <div style={{ position: 'relative' }}>{children}</div>
                        </CalendarContainer>
                    </div>
                )
            },
        [width]
    )

    const setDate = useCallback(
        (date: Date | null) => {
            onChange?.(date)
        },
        [onChange]
    )

    return (
        <div className={classNames(className, 'flex flex-col ring-0')} ref={ref}>
            {value && <label className="text-xs text-slate-500 mb-2">{label}</label>}
            <DatePicker
                className={classNames(
                    'flex items-center w-full h-10 border-[2px] bg-slate-50 px-5 text-xs rounded-lg',
                    'outline-none focus:ring-4',
                    invalid
                        ? 'hover:border-red-900/20 focus:border-red-600 ring-red-600/20 text-red-600 placeholder:text-red-400 border-red-200'
                        : 'hover:border-primary/20 focus:border-primary ring-primary/20',
                    'placeholder:text-slate-400 border-slate-200'
                )}
                calendarClassName="w-full"
                calendarStartDay={1} // Monday
                selected={value}
                maxDate={new Date()}
                onChange={setDate}
                placeholderText={placeholder}
                calendarContainer={Container}
                renderCustomHeader={CustomHeader}
                formatWeekDay={formatWeekDay}
                dateFormat="do MMMM yyyy"
            />
            {invalid && (
                <div className="mt-2 grid grid-cols-1 gap-2">
                    {errors.map((error, i) => {
                        return <ValidationMessage message={error} type="error" key={i} />
                    })}
                </div>
            )}
        </div>
    )
}
