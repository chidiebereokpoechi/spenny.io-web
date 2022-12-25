import { Allow, IsDate, IsEnum, IsNumber, IsPositive, MinLength, ValidateIf } from 'class-validator'
import { clone, isInteger, isNumber } from 'lodash'
import { RecurrenceUnit, TransactionStatus, TransactionType } from '../../../util/constants'
import { Satisfies } from '../../../util/validation/decorators'
import { Tracker } from '../../response'
import { BaseModel } from '../base.model'

export class CreateTransactionModel extends BaseModel {
    @MinLength(1, { message: 'You have to provide a label' })
    public label: string = ''

    @MinLength(1)
    @ValidateIf((o: CreateTransactionModel) => !!o.description, { message: 'You need a description' })
    public description: string = ''

    @IsEnum(TransactionType, { message: 'Please select a transaction type' })
    public type: string = ''

    @IsEnum(TransactionStatus, { message: 'Please select a transaction status' })
    public status: string = ''

    @IsPositive({ message: 'You have to enter a number (greater than 0)' })
    public amount?: number

    @IsDate({ message: 'Please provide a valid date' })
    public date: Date | null = null

    @Satisfies((value: number) => (isNumber(value) ? isInteger(value) : true), { message: 'No fractional values!' })
    @IsPositive({ message: 'You have to enter a number (at least 1)' })
    public every?: number

    @IsEnum(RecurrenceUnit, { message: 'Please select a time unit' })
    public recurrenceUnit: string = ''

    @Satisfies((value: number) => +value >= 1, { each: true })
    @Satisfies(isInteger, { each: true })
    @IsNumber(undefined, { each: true })
    public categories: number[] = []

    @Allow()
    public trackerId!: number

    constructor(tracker: Tracker) {
        super()
        this.trackerId = tracker.id
    }

    public getRequestBody<CreateTransactionModel>(): CreateTransactionModel {
        const body: any = clone(this)
        body.date = this.date?.toISOString()
        return body
    }
}
