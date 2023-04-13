import { isSameMonth } from 'date-fns'
import { every, filter, map, orderBy, remove, sum } from 'lodash'
import { DateTime, Duration } from 'luxon'
import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateTransactionModel, UpdateTransactionModel } from '../models/request'
import { ComputedTransaction, Transaction, TransactionAggregate } from '../models/response'
import { HttpMethod, TransactionStatus, TransactionType } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { describeRecurrence, getAddDateFunction } from '../util/time'

const TRANSACTIONS_KEY = 'SPENNY.IO:TRANSACTIONS'

export class TransactionsStore implements Resettable {
    public transactions: Transaction[] = []
    public aggregate: Nullable<TransactionAggregate> = null
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    private getAggregate(): TransactionAggregate {
        const transactions = map(this.transactions, this.processTransaction)
        const expenses = filter(transactions, { type: TransactionType.Expense })
        const income = filter(transactions, { type: TransactionType.Income })

        const totalExpenses = sum(map(expenses, 'amount'))
        const totalIncome = sum(map(income, 'amount'))
        const totalNet = totalIncome - totalExpenses

        const estimatedMonthlyExpenses = sum(map(expenses, 'estimatedMonthly'))
        const estimatedMonthlyIncome = sum(map(income, 'estimatedMonthly'))
        const estimatedMonthlyNet = estimatedMonthlyIncome - estimatedMonthlyExpenses

        const aggregate: TransactionAggregate = {
            transactions,
            dueThisMonth: sum(map(transactions, 'dueThisMonth')),
            leastExpensiveMonth: ['January', 20], // TODO: remove stub
            mostExpensiveMonth: ['January', 20], // TODO: remove stub
            paidThisMonth: every(transactions, 'paid'),
            totalAmount: [totalIncome, totalExpenses, totalNet],
            totalEstimatedMonthly: [estimatedMonthlyIncome, estimatedMonthlyExpenses, estimatedMonthlyNet],
        }

        return aggregate
    }

    private fallbackIfInactive<T>(isActive: boolean, valueIfActive: T, valueIfInactive: T): T {
        return isActive ? valueIfActive : valueIfInactive
    }

    private processTransaction(transaction: Transaction): ComputedTransaction {
        const unit = transaction.recurrence_unit
        const dateOfPurchase = DateTime.fromISO(transaction.date)
        const durationSincePurchase = DateTime.fromMillis(Date.now()).diff(dateOfPurchase, unit, {
            conversionAccuracy: 'longterm',
        })

        const isActive = transaction.status === TransactionStatus.Active

        const addFunction = getAddDateFunction(unit)
        const multiplier = Math.ceil(durationSincePurchase.as(transaction.recurrence_unit) / transaction.every)
        const nextPaymentDate = addFunction(dateOfPurchase.toJSDate(), transaction.every * multiplier)
        const nextPaymentFormatted = DateTime.fromJSDate(nextPaymentDate).toFormat('dd MMMM yyyy')
        const sameMonth = isSameMonth(new Date(), nextPaymentDate)
        const dueThisMonth = transaction.type === TransactionType.Expense && sameMonth ? transaction.amount : 0
        const sortedCategories = orderBy(transaction.categories, 'label')
        const estimatedMonthly = transaction.amount / Duration.fromObject({ [unit]: transaction.every }).as('months')

        return {
            label: transaction.label,
            description: transaction.description,
            categories: sortedCategories,
            categoriesValue: map(sortedCategories, 'label.0').join(''),
            status: transaction.status,
            type: transaction.type,
            wallet: transaction.wallet,
            walletValue: transaction.wallet.id,
            amount: transaction.amount,
            date: transaction.date,
            recurs: describeRecurrence(transaction.every, unit),
            recurrenceValue: Duration.fromObject({ [unit]: transaction.every }).toMillis(),
            nextPayment: nextPaymentDate.toISOString(),
            nextPaymentFormatted: nextPaymentFormatted,
            estimatedMonthly: this.fallbackIfInactive(isActive, estimatedMonthly, 0),
            dueThisMonth: this.fallbackIfInactive(isActive, dueThisMonth, 0),
            paid: this.fallbackIfInactive(isActive, dueThisMonth === 0, true),
            transaction,
        }
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
    public reset() {
        this.transactions = []
        this.loading = false
        this.ready = false
    }
}
