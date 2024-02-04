import { isSameMonth, startOfMonth } from 'date-fns'
import { map, orderBy } from 'lodash'
import { DateTime, Duration } from 'luxon'
import { ComputedTransaction, Transaction, Wallet } from '../models/response'
import { RecurrenceUnit, TransactionStatus, TransactionType } from '../util/constants'
import { describeRecurrence, floorDateTime } from '../util/time'
import { calculateNextPaymentDate } from '../util/time/advance'
import { DomainCategory } from './category'
import { TransactionFilter } from './transaction-filter'

export class DomainTransaction {
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

    #id: number
    #excluded: boolean

    public get id(): number {
        return this.#id
    }

    public get isExcluded(): boolean {
        return this.#excluded
    }

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
        excluded: boolean,
        createdAt: DateTime,
        updatedAt: DateTime
    ) {
        this.#id = id
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
        this.#excluded = excluded
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
            floorDateTime(DateTime.fromISO(date).setZone('utc', { keepLocalTime: true })),
            every,
            recurrence_unit,
            map(categories, DomainCategory.fromPlain),
            wallet,
            false,
            DateTime.fromISO(created_at),
            DateTime.fromISO(updated_at)
        )
    }

    public setExclusion(excluded: boolean) {
        this.#excluded = excluded
    }

    private getNextPaymentDate(date: DateTime, why?: string) {
        const nextPaymentDate = calculateNextPaymentDate(this.date, date, this.every, this.recurrenceUnit)

        return {
            nextPaymentDate,
            nextPaymentISO: nextPaymentDate.toISO(),
            nextPaymentFormatted: nextPaymentDate.toFormat('dd MMMM yyyy'),
        }
    }

    public getAmountForSelectedMonth(date: DateTime): number {
        if (this.#excluded) return 0

        const endDate = DateTime.fromJSDate(startOfMonth(date.toJSDate()))
        const { nextPaymentDate } = this.getNextPaymentDate(endDate, 'Selected month')
        const sameMonth = isSameMonth(date.toJSDate(), nextPaymentDate.toJSDate())
        return sameMonth && this.isActive ? this.amount : 0
    }

    public getDueThisMonth(date: DateTime): number {
        if (this.#excluded) return 0

        const { nextPaymentDate } = this.getNextPaymentDate(date, 'Due this month')
        const inTheSameMonth = date.month === nextPaymentDate.month && date.year === nextPaymentDate.year

        if (this.type === TransactionType.Expense && this.isActive) {
            if (inTheSameMonth && nextPaymentDate >= date) return this.amount
        }

        return 0
    }

    public filter(filter: TransactionFilter): boolean {
        const { name, wallets } = filter

        if (name && !this.label.toLowerCase().includes(name.toLowerCase())) return false
        if (wallets && wallets.length && (!this.wallet || !wallets.includes(this.wallet.id))) return false

        return true
    }

    public computeForDate(date: DateTime): ComputedTransaction {
        const { categories, categoriesValue } = this.orderedCategories
        const { recurs, recurrenceValue } = this.recurrence
        const { nextPaymentISO: nextPayment, nextPaymentFormatted } = this.getNextPaymentDate(date, 'Computed')
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
            started: this.date.toISO(),
            startedFormatted: this.date.toFormat('dd MMMM yyyy'),
            recurs,
            recurrenceValue,
            nextPayment,
            nextPaymentFormatted,
            estimatedMonthly: this.estimatedMonthly,
            dueThisMonth,
            selectedMonth,
            paid: dueThisMonth === 0,
            transaction: this,
        }
    }

    public toPlain(): Transaction {
        return {
            id: this.#id,
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
