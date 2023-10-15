import { clone } from 'lodash'
import { DateTime } from 'luxon'

export const floorDate = (date: Date): Date => {
    const updated = clone(date)
    updated.setHours(0, 0, 0, 0)
    return updated
}

export const floorDateTime = (date: DateTime): DateTime => {
    const updated = clone(date)
    updated.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    return updated
}
