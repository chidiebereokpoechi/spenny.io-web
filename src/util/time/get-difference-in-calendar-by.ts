import {
    differenceInCalendarDays,
    differenceInCalendarMonths,
    differenceInCalendarWeeks,
    differenceInCalendarYears,
} from 'date-fns'
import { RecurrenceUnit } from '../constants'
import { DateTime } from 'luxon'

export const getDifferenceInCalendarUnits = (from: DateTime, to: DateTime, unit: RecurrenceUnit): number => {
    const fromDate = from.toJSDate()
    const toDate = to.toJSDate()
    return getDifferenceInCalendarBy(unit)(toDate, fromDate)
}

const getDifferenceInCalendarBy = (unit: RecurrenceUnit) => {
    switch (unit) {
        case RecurrenceUnit.Day:
            return differenceInCalendarDays
        case RecurrenceUnit.Month:
            return differenceInCalendarMonths
        case RecurrenceUnit.Week:
            return differenceInCalendarWeeks
        default:
            return differenceInCalendarYears
    }
}
