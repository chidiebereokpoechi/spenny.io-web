import { Transaction } from './transaction'

export interface ComputedTransaction {
    label: string
    description: Transaction['description']
    type: Transaction['type']
    categories: Transaction['categories']
    amount: number
    date: string
    recurs: string
    nextPayment: string
    nextPaymentFormatted: string
    dueThisMonth: number
    paid: boolean
    transaction: Transaction
}
