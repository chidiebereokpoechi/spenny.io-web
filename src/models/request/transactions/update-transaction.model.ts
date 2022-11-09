import { map } from 'lodash'
import { Tracker, Transaction } from '../../response'
import { CreateTransactionModel } from './create-transaction.model'

export class UpdateTransactionModel extends CreateTransactionModel {
    constructor(transaction: Transaction, tracker: Tracker) {
        super(tracker)
        this.label = transaction.label
        this.description = transaction.description ?? ''
        this.type = transaction.type
        this.amount = transaction.amount.toFixed(2)
        this.date = transaction.date
        this.every = transaction.every
        this.recurrenceUnit = transaction.recurrence_unit
        this.categories = map(transaction.categories, 'id')
    }
}
