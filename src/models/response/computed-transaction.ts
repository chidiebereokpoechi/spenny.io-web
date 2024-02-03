import { DomainTransaction } from '../../domain'
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
    started: string
    startedFormatted: string
    recurs: string
    recurrenceValue: number
    nextPayment: string
    nextPaymentFormatted: string
    selectedMonth: number
    estimatedMonthly: number
    dueThisMonth: number
    paid: boolean
    transaction: DomainTransaction
}
