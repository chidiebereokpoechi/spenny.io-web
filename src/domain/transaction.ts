import { isSameMonth } from 'date-fns'
import { map, orderBy } from 'lodash'
import { DateTime, Duration } from 'luxon'
import { ComputedTransaction, Transaction, Wallet } from '../models/response'
import { RecurrenceUnit, TransactionStatus, TransactionType } from '../util/constants'
import { describeRecurrence } from '../util/time'
import { DomainCategory } from './category'

export class DomainTransaction {
    public readonly id: number
    public readonly label: string
    public readonly description?: string
    private readonly imageUrl?: string
    public readonly status: TransactionStatus
    public readonly type: TransactionType
    public readonly amount: number
    public readonly date: DateTime
    public readonly every: number
    public readonly recurrenceUnit: RecurrenceUnit
    private readonly categories: DomainCategory[]
    public readonly wallet?: Wallet
    public readonly createdAt: DateTime
    public readonly updatedAt: DateTime

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

    public get dueThisMonth(): number {
        const now = DateTime.now()
        const amount = this.getAmountForSelectedMonth(now)
        return this.isActive ? amount : 0
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
        const { nextPaymentDate } = this.getNextPaymentDate(date)
        const sameMonth = isSameMonth(date.toJSDate(), nextPaymentDate.toJSDate())
        return this.type === TransactionType.Expense && sameMonth ? this.amount : 0
    }

    public computeForDate(date: DateTime): ComputedTransaction {
        const { categories, categoriesValue } = this.orderedCategories
        const { recurs, recurrenceValue } = this.recurrence
        const { nextPaymentISO: nextPayment, nextPaymentFormatted } = this.getNextPaymentDate(date)
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
            dueThisMonth: this.dueThisMonth,
            selectedMonth,
            paid: this.dueThisMonth === 0,
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
