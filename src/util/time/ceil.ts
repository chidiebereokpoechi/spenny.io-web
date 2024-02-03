import { DateTime } from 'luxon'

export const ceilDate = (date: Date): Date => {
    const updated = new Date(date)
    updated.setHours(23, 59, 59, 999)
    return updated
}

export const ceilDateTime = (date: DateTime): DateTime => {
    return date.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
}
