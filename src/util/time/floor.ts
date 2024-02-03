import { DateTime } from 'luxon'

export const floorDate = (date: Date): Date => {
    const updated = new Date(date)
    updated.setHours(0, 0, 0, 0)
    return updated
}

export const floorDateTime = (date: DateTime): DateTime => {
    return date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
}
