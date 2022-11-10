import { Option } from '../misc'

export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export const transactionTypes = [TransactionType.Income, TransactionType.Expense]

export const transactionTypeOptions: Option[] = [
    {
        display: 'Income',
        value: TransactionType.Income,
    },
    {
        display: 'Expense',
        value: TransactionType.Expense,
    },
]
