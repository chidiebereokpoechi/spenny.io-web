import { endOfMonth, isSameMonth } from 'date-fns'
import { map, orderBy } from 'lodash'
import { DateTime, Duration } from 'luxon'
import { ComputedTransaction, Transaction, Wallet } from '../models/response'
import { RecurrenceUnit, TransactionStatus, TransactionType } from '../util/constants'
import { describeRecurrence } from '../util/time'
import { DomainCategory } from './category'

export class DomainTransaction {
    private readonly id: number
    private readonly label: string
    private readonly description?: string
    private readonly imageUrl?: string
    private readonly status: TransactionStatus
    private readonly type: TransactionType
    private readonly amount: number
    private readonly date: DateTime
    private readonly every: number
    private readonly recurrenceUnit: RecurrenceUnit
    private readonly categories: DomainCategory[]
    private readonly wallet?: Wallet
    private readonly createdAt: DateTime
    private readonly updatedAt: DateTime

    public get isActive(): boolean {
        return this.status === TransactionStatus.Active
    }

    public get recurrence() {
        return {
            recurs: describeRecurrence(this.every, this.recurrenceUnit),
            recurrenceValue: Duration.fromObject({ [this.recurrenceUnit]: this.every }).toMillis(),
        }
    }

    public get orderedCategories() {
        const categories = orderBy(this.categories, 'sortableValue')

        return {
            categories: map(categories, (category) => category.toPlain()),
            categoriesValue: map(categories, 'sortableValue').join(''),
        }
    }

    public get estimatedMonthly(): number {
        return this.isActive ? this.amount / Duration.fromObject({ [this.recurrenceUnit]: this.every }).as('months') : 0
    }

    constructor(
        id: number,
        label: string,
        description: string | undefined,
        imageUrl: string | undefined,
        status: TransactionStatus,
        type: TransactionType,
        amount: number,
        date: DateTime,
        every: number,
        recurrenceUnit: RecurrenceUnit,
        categories: DomainCategory[],
        wallet: Wallet | undefined,
        createdAt: DateTime,
        updatedAt: DateTime
    ) {
        this.id = id
        this.label = label
        this.description = description
        this.imageUrl = imageUrl
        this.status = status
        this.type = type
        this.amount = amount
        this.date = date
        this.every = every
        this.recurrenceUnit = recurrenceUnit
        this.categories = categories
        this.wallet = wallet
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static fromPlain({
        id,
        label,
        description,
        image_url,
        status,
        type,
        amount,
        date,
        every,
        recurrence_unit,
        categories,
        wallet,
        created_at,
        updated_at,
    }: Transaction) {
        return new DomainTransaction(
            id,
            label,
            description ?? undefined,
            image_url ?? undefined,
            status,
            type,
            amount,
            DateTime.fromISO(date),
            every,
            recurrence_unit,
            map(categories, DomainCategory.fromPlain),
            wallet,
            DateTime.fromISO(created_at),
            DateTime.fromISO(updated_at)
        )
    }

    private getDurationSincePurchase(date: DateTime): Duration {
        return date.diff(this.date, this.recurrenceUnit, { conversionAccuracy: 'longterm' })
    }

    private getNextPaymentDate(date: DateTime) {
        const durationSincePurchase = this.getDurationSincePurchase(date)
        const multiplier = Math.ceil(durationSincePurchase.as(this.recurrenceUnit) / this.every)
        const advanceBy = this.every * multiplier

        const nextPaymentDate = this.date.plus({ [this.recurrenceUnit]: advanceBy })
        const nextPaymentFormatted = nextPaymentDate.toFormat('dd MMMM yyyy')

        return {
            nextPaymentDate,
            nextPaymentISO: nextPaymentDate.toISO(),
            nextPaymentFormatted,
        }
    }

    public getAmountForSelectedMonth(date: DateTime): number {
        const endDate = DateTime.fromJSDate(endOfMonth(date.toJSDate())).minus({ month: 1 })
        const { nextPaymentDate } = this.getNextPaymentDate(endDate)
        const sameMonth = isSameMonth(date.toJSDate(), nextPaymentDate.toJSDate())
        return sameMonth && this.isActive ? this.amount : 0
    }

    public getDueThisMonth(date: DateTime): number {
        const { nextPaymentDate } = this.getNextPaymentDate(date)
        const sameMonth = isSameMonth(date.toJSDate(), nextPaymentDate.toJSDate())
        return this.type === TransactionType.Expense && this.isActive && sameMonth ? this.amount : 0
    }

    public matchesFilter(filter: string): boolean {
        return this.label.toLowerCase().includes(filter.toLowerCase().trim())
    }

    public computeForDate(date: DateTime): ComputedTransaction {
        const { categories, categoriesValue } = this.orderedCategories
        const { recurs, recurrenceValue } = this.recurrence
        const { nextPaymentISO: nextPayment, nextPaymentFormatted } = this.getNextPaymentDate(date)
        const dueThisMonth = this.getDueThisMonth(date)
        const selectedMonth = this.getAmountForSelectedMonth(date)

        return {
            label: this.label,
            description: this.description ?? null,
            categories,
            categoriesValue,
            status: this.status,
            type: this.type,
            wallet: this.wallet,
            walletValue: this.wallet?.id,
            amount: this.amount,
            date: this.date.toISO(),
            recurs,
            recurrenceValue,
            nextPayment,
            nextPaymentFormatted,
            estimatedMonthly: this.estimatedMonthly,
            dueThisMonth,
            selectedMonth,
            paid: dueThisMonth === 0,
            transaction: this.toPlain(),
        }
    }

    public toPlain(): Transaction {
        return {
            id: this.id,
            label: this.label,
            description: this.description ?? null,
            image_url: this.imageUrl ?? null,
            status: this.status,
            type: this.type,
            amount: this.amount,
            date: this.date.toISO(),
            every: this.every,
            recurrence_unit: this.recurrenceUnit,
            categories: map(this.categories, (category) => category.toPlain()),
            wallet: this.wallet,
            created_at: this.createdAt.toISO(),
            updated_at: this.updatedAt.toISO(),
        }
    }
}
