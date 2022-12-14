import { addDays, addMonths, addWeeks, addYears, isSameMonth } from 'date-fns'
import { capitalize, map, orderBy } from 'lodash'
import { DateTime, Duration } from 'luxon'
import { action, computed, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateTransactionModel, UpdateTransactionModel } from '../models/request'
import { ComputedTransaction, Transaction } from '../models/response'
import { HttpMethod, RecurrenceUnit, recurrenceUnitWordVariantMap } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'

const TRANSACTIONS_KEY = 'SPENNY.IO:TRANSACTIONS'

export class TransactionsStore implements Resettable {
    public transactions: Transaction[] = []
    public loading: boolean = false
    public ready: boolean = false

    @computed
    public get computedTransactions(): ComputedTransaction[] {
        return map(this.transactions, this.transformTransaction)
    }

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    private describeRecurrence(amount: number, unit: RecurrenceUnit): string {
        const variants = recurrenceUnitWordVariantMap[unit]

        if (amount === 1) {
            return capitalize(variants.period)
        }

        return `Every ${amount} ${variants.plural}`
    }

    private getAddDateFunction(unit: RecurrenceUnit) {
        switch (unit) {
            case RecurrenceUnit.Day:
                return addDays
            case RecurrenceUnit.Month:
                return addMonths
            case RecurrenceUnit.Week:
                return addWeeks
            default:
                return addYears
        }
    }

    private transformTransaction(transaction: Transaction): ComputedTransaction {
        const unit = transaction.recurrence_unit
        const dateOfPurchase = DateTime.fromISO(transaction.date)
        const durationSincePurchase = DateTime.fromMillis(Date.now()).diff(dateOfPurchase, unit, {
            conversionAccuracy: 'longterm',
        })

        const addFunction = this.getAddDateFunction(unit)
        const multiplier = Math.ceil(durationSincePurchase.as(transaction.recurrence_unit) / transaction.every)
        const nextPaymentDate = addFunction(dateOfPurchase.toJSDate(), transaction.every * multiplier)
        const nextPaymentFormatted = DateTime.fromJSDate(nextPaymentDate).toFormat('dd MMMM yyyy')
        const sameMonth = isSameMonth(new Date(), nextPaymentDate)
        const dueThisMonth = sameMonth ? transaction.amount : 0
        const sortedCategories = orderBy(transaction.categories, 'label')

        return {
            label: transaction.label,
            description: transaction.description,
            categories: sortedCategories,
            categoriesValue: map(sortedCategories, 'label.0').join(''),
            type: transaction.type,
            amount: transaction.amount,
            date: transaction.date,
            recurs: this.describeRecurrence(transaction.every, unit),
            recurrenceValue: Duration.fromObject({ [unit]: transaction.every }).toMillis(),
            nextPayment: nextPaymentDate.toISOString(),
            nextPaymentFormatted: nextPaymentFormatted,
            dueThisMonth,
            paid: dueThisMonth === 0,
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
