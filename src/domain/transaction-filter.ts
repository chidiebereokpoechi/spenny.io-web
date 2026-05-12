import { Wallet } from '../models/response'

export interface TransactionFilter {
    name?: string
    wallets?: Wallet['id'][]
}
