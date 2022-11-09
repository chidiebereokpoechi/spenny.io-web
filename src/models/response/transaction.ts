import { RecurrenceUnit, TransactionType } from '../../util/constants'
import { Category } from './category'

export interface Transaction {
    id: number
    label: string
    description: string | null
    image_url: string | null
    type: TransactionType
    amount: number
    date: string
    every: string
    recurrence_unit: RecurrenceUnit
    categories: Category[]
    created_at: string
    updated_at: string
}
