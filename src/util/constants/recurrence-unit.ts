import { Option } from '../misc'

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
