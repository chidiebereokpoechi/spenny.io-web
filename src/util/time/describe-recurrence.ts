import { capitalize } from 'lodash'
import { RecurrenceUnit, recurrenceUnitWordVariantMap } from '../constants'

export const describeRecurrence = (amount: number, unit: RecurrenceUnit): string => {
    const variants = recurrenceUnitWordVariantMap[unit]

    if (amount === 1) {
        return capitalize(variants.period)
    }

    return `Every ${amount} ${variants.plural}`
}
