import { Transaction } from './transaction'

export interface ComputedTransaction {
    label: string
    description: Transaction['description']
    status: Transaction['status']
    type: Transaction['type']
    wallet: Transaction['wallet']
    walletValue?: number
    categories: Transaction['categories']
    categoriesValue: string
    amount: number
    date: string
    recurs: string
    recurrenceValue: number
    nextPayment: string
    nextPaymentFormatted: string
    estimatedMonthly: number
    dueThisMonth: number
    paid: boolean
    transaction: Transaction
}
