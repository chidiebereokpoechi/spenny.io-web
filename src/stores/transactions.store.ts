import { every, filter, map, orderBy, remove, sum } from 'lodash'
import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateTransactionModel, UpdateTransactionModel } from '../models/request'
import { Transaction, TransactionAggregate } from '../models/response'
import { HttpMethod, TransactionType } from '../util/constants'
import { Resettable, dehydrateToStorage, hydrateFromStorage } from '../util/misc'
import { request } from '../util/request'
import { DomainTransaction } from '../domain'
import { DateTime } from 'luxon'

const TRANSACTIONS_KEY = 'SPENNY.IO:TRANSACTIONS'

export class TransactionsStore implements Resettable {
    public transactions: Transaction[] = []
    public aggregate: Nullable<TransactionAggregate> = null
    public loading: boolean = false
    public ready: boolean = false
    public date: Date = new Date()
    public filter: string = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    private getAggregate(): TransactionAggregate {
        const domainTransactions = map(this.transactions, (transaction) => DomainTransaction.fromPlain(transaction))
        const transactions = map(
            filter(domainTransactions, (transaction) => transaction.matchesFilter(this.filter)),
            (transaction) => transaction.computeForDate(DateTime.fromJSDate(this.date))
        )

        const expenses = filter(transactions, { type: TransactionType.Expense })
        const income = filter(transactions, { type: TransactionType.Income })

        const totalExpenses = sum(map(expenses, 'amount'))
        const totalIncome = sum(map(income, 'amount'))
        const totalNet = totalIncome - totalExpenses

        const selectedMonthExpenses = sum(map(expenses, 'selectedMonth'))
        const selectedMonthIncome = sum(map(income, 'selectedMonth'))
        const selectedMonthNet = selectedMonthIncome - selectedMonthExpenses

        const aggregate: TransactionAggregate = {
            transactions: orderBy(transactions, 'paid'),
            dueThisMonth: sum(map(transactions, 'dueThisMonth')),
            leastExpensiveMonth: ['January', 20], // TODO: remove stub
            mostExpensiveMonth: ['January', 20], // TODO: remove stub
            paidThisMonth: every(transactions, 'paid'),
            totalAmount: [totalIncome, totalExpenses, totalNet],
            totalSelectedMonth: [selectedMonthIncome, selectedMonthExpenses, selectedMonthNet],
        }

        return aggregate
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
    public deleteTransaction(id: number) {
        this.loading = true

        return request<never>(`/transactions/${id}`, HttpMethod.Delete, {}).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.ok) {
                        remove(this.transactions, { id })
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
        this.aggregate = this.getAggregate()
        dehydrateToStorage(TRANSACTIONS_KEY, transactions)
    }

    @action
    public setDate(date: Date): void {
        this.date = date
        this.aggregate = this.getAggregate()
    }

    @action
    public setFilter(filter: string): void {
        this.filter = filter
        this.aggregate = this.getAggregate()
    }

    @action
    public reset() {
        this.transactions = []
        this.loading = false
        this.ready = false
    }
}
