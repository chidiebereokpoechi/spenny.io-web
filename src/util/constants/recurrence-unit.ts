import { Option } from '../misc'
import { WordVariants } from '../misc/word-variants'

export enum RecurrenceUnit {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Year = 'year',
}

export const recurrenceUnits = [RecurrenceUnit.Day, RecurrenceUnit.Week, RecurrenceUnit.Month, RecurrenceUnit.Year]

export const recurrenceUnitOptions: Option[] = [
    {
        display: 'Day',
        value: RecurrenceUnit.Day,
    },
    {
        display: 'Week',
        value: RecurrenceUnit.Week,
    },
    {
        display: 'Month',
        value: RecurrenceUnit.Month,
    },
    {
        display: 'Year',
        value: RecurrenceUnit.Year,
    },
]

interface Variants extends WordVariants {
    period: string
}

export const recurrenceUnitWordVariantMap: Record<RecurrenceUnit, Variants> = {
    [RecurrenceUnit.Day]: {
        singular: 'day',
        plural: 'days',
        period: 'daily',
    },
    [RecurrenceUnit.Week]: {
        singular: 'week',
        plural: 'weeks',
        period: 'weekly',
    },
    [RecurrenceUnit.Month]: {
        singular: 'month',
        plural: 'months',
        period: 'monthly',
    },
    [RecurrenceUnit.Year]: {
        singular: 'year',
        plural: 'years',
        period: 'yearly',
    },
}
