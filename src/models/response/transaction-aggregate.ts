import { ComputedTransaction } from './computed-transaction'

export interface TransactionAggregate {
    transactions: ComputedTransaction[]
    mostExpensiveMonth: [name: string, cost: number]
    leastExpensiveMonth: [name: string, cost: number]
    totalAmount: [income: number, expense: number, net: number]
    totalEstimatedMonthly: [income: number, expense: number, net: number]
    dueThisMonth: number
    paidThisMonth: boolean
}
