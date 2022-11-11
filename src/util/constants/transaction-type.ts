import { Option } from '../misc'
import { LabelInfo } from './label-info'
import { Palette } from './palette'

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

export const transactionTypeLabelMap: Record<TransactionType, LabelInfo> = {
    [TransactionType.Expense]: {
        backgroundColor: Palette.Scales[1],
        color: Palette.Slate[1],
        text: 'Expense',
    },
    [TransactionType.Income]: {
        backgroundColor: Palette.Scales[2],
        color: Palette.Slate[1],
        text: 'Income',
    },
}
