import { differenceInCalendarMonths, differenceInDays, differenceInWeeks } from 'date-fns'
import { DateTime } from 'luxon'
import { RecurrenceUnit } from '../constants'

export const getDifferenceInCalendarUnits = (from: DateTime, to: DateTime, unit: RecurrenceUnit): number => {
    const fromDate = from.toJSDate()
    const toDate = to.toJSDate()
    return getDifferenceInCalendarBy(unit)(toDate, fromDate)
}

const differenceInYears = (toDate: Date, fromDate: Date) => {
    return toDate.getFullYear() - fromDate.getFullYear()
}

const differenceInMonths = (toDate: Date, fromDate: Date) => {
    return differenceInCalendarMonths(toDate, fromDate)
}

const getDifferenceInCalendarBy = (unit: RecurrenceUnit) => {
    switch (unit) {
        case RecurrenceUnit.Day:
            return differenceInDays
        case RecurrenceUnit.Month:
            return differenceInMonths
        case RecurrenceUnit.Week:
            return differenceInWeeks
        default:
            return differenceInYears
    }
}
