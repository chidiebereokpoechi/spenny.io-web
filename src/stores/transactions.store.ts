import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateTransactionModel, UpdateTransactionModel } from '../models/request'
import { Transaction } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'

const TRANSACTIONS_KEY = 'SPENNY.IO:TRANSACTIONS'

export class TransactionsStore implements Resettable {
    public transactions: Transaction[] = []
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.transactions = hydrateFromStorage(TRANSACTIONS_KEY) ?? []
        this.ready = true
    }

    @action
    public createTransaction(model: CreateTransactionModel) {
        this.loading = true

        return request<CreateTransactionModel, Transaction>('/transactions', HttpMethod.Post, {
            body: model.getRequestBody(),
        }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listTransactionsForTracker(model.trackerId).subscribe()
                    }
                })
            })
        )
    }

    @action
    public updateTransaction(id: number, model: UpdateTransactionModel) {
        this.loading = true

        return request<UpdateTransactionModel, Transaction>(`/transactions/${id}`, HttpMethod.Patch, {
            body: model.getRequestBody(),
        }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listTransactionsForTracker(model.trackerId).subscribe()
                    }
                })
            })
        )
    }

    @action
    public listTransactionsForTracker(trackerId: number) {
        this.transactions = []
        this.ready = false
        this.loading = true

        return request<never, Transaction[]>(`/transactions/tracker/${trackerId}`, HttpMethod.Get).pipe(
            tap((response) => {
                runInAction(() => {
                    this.ready = true
                    this.loading = false

                    if (response.data) {
                        this.setTransactions(response.data)
                    }
                })
            })
        )
    }

    @action
    public setTransactions(transactions: Transaction[]): void {
        this.transactions = transactions
        dehydrateToStorage(TRANSACTIONS_KEY, transactions)
    }

    @action
    public reset() {
        this.transactions = []
        this.loading = false
        this.ready = false
    }
}
