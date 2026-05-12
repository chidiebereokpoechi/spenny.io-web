import { DateTime } from 'luxon'
import { RecurrenceUnit } from '../constants'

export const calculateNextPaymentDate = (
    date: DateTime,
    currentDate: DateTime,
    every: number,
    unit: RecurrenceUnit
): DateTime => {
    if (date >= currentDate) {
        return date
    }

    return calculateNextPaymentDate(date.plus({ [unit]: every }), currentDate, every, unit)
}
