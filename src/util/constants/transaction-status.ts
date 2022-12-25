import { Option } from '../misc'
import { LabelInfo } from './label-info'
import { Palette } from './palette'

export enum TransactionStatus {
    Active = 'active',
    OnHold = 'on-hold',
    Canceled = 'canceled',
}

export const transactionStatuses = [TransactionStatus.Active, TransactionStatus.OnHold, TransactionStatus.Canceled]

export const transactionStatusOptions: Option[] = [
    {
        display: 'Active',
        value: TransactionStatus.Active,
    },
    {
        display: 'On Hold',
        value: TransactionStatus.OnHold,
    },
    {
        display: 'Canceled',
        value: TransactionStatus.Canceled,
    },
]

export const transactionStatusLabelMap: Record<TransactionStatus, LabelInfo> = {
    [TransactionStatus.Active]: {
        backgroundColor: Palette.Salmon[7],
        color: Palette.Slate[1],
        text: 'Active',
    },
    [TransactionStatus.OnHold]: {
        backgroundColor: Palette.Spring[5],
        color: Palette.Slate[5],
        text: 'On Hold',
    },
    [TransactionStatus.Canceled]: {
        backgroundColor: Palette.Spring[0],
        color: Palette.Slate[1],
        text: 'Canceled',
    },
}
