import { addDays, addMonths, addWeeks, addYears } from 'date-fns'
import { RecurrenceUnit } from '../constants'

export const getAddDateFunction = (unit: RecurrenceUnit) => {
    switch (unit) {
        case RecurrenceUnit.Day:
            return addDays
        case RecurrenceUnit.Month:
            return addMonths
        case RecurrenceUnit.Week:
            return addWeeks
        default:
            return addYears
    }
}
