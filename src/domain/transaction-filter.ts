import { Wallet } from '../models/response'
import { TransactionType } from '../util/constants'

export interface TransactionFilter {
    name?: string
    wallets?: Wallet['id'][]
    types?: TransactionType[]
}
