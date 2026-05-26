import { Wallet } from '../models/response'
import { TransactionStatus, TransactionType } from '../util/constants'

export interface TransactionFilter {
    name?: string
    wallets?: Wallet['id'][]
    types?: TransactionType[]
    statuses?: TransactionStatus[]
}
