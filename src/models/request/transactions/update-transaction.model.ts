import { map } from 'lodash'
import { DomainTransaction } from '../../../domain'
import { Tracker } from '../../response'
import { CreateTransactionModel } from './create-transaction.model'

export class UpdateTransactionModel extends CreateTransactionModel {
    constructor(domainTransaction: DomainTransaction, tracker: Tracker) {
        super(tracker)
        const transaction = domainTransaction.toPlain()

        this.label = transaction.label
        this.description = transaction.description ?? ''
        this.walletId = transaction.wallet?.id ?? null
        this.type = transaction.type
        this.status = transaction.status
        this.amount = transaction.amount
        this.date = new Date(transaction.date)
        this.every = transaction.every
        this.recurrenceUnit = transaction.recurrence_unit
        this.categories = map(transaction.categories, 'id')
    }
}
