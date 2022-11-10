import { DateTime } from 'luxon'

export const formatWeekDay =
    // MON, TUE, WED, ...
    (weekDay: string) => {
        return weekDay.substring(0, 3)
    }

export const formatMonthYear = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('MMMM, yyyy')
}
