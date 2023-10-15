import { clone } from 'lodash'
import { DateTime } from 'luxon'

export const ceilDate = (date: Date): Date => {
    const updated = clone(date)
    updated.setHours(23, 59, 59, 999)
    return updated
}

export const ceilDateTime = (date: DateTime): DateTime => {
    const updated = clone(date)
    updated.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    return updated
}
