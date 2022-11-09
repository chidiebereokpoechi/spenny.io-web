import { action } from 'mobx'
import { Transaction } from '../models/response'
import { Resettable } from '../util/misc'

export class TransactionsStore implements Resettable {
    public transactions: Transaction[] = []
    public loading: boolean = false
    public ready: boolean = false

    @action
    public reset() {
        this.transactions = []
        this.loading = false
        this.ready = false
    }
}
