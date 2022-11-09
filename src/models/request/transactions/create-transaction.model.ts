import { Allow, IsDateString, IsEnum, IsNumber, IsNumberString, MinLength, ValidateIf } from 'class-validator'
import { isBefore } from 'date-fns'
import { clone, isInteger } from 'lodash'
import { RecurrenceUnit, TransactionType } from '../../../util/constants'
import { Satisfies } from '../../../util/validation/decorators'
import { Tracker } from '../../response'
import { BaseModel } from '../base.model'

export class CreateTransactionModel extends BaseModel {
    @MinLength(1, { message: 'You have to provide a label' })
    public label: string = ''

    @ValidateIf((o: CreateTransactionModel) => !!o.description)
    @MinLength(1)
    public description: string = ''

    @IsEnum(TransactionType, { message: 'Invalid transaction type' })
    public type: string = ''

    @IsNumberString()
    @Satisfies((value: number) => +value >= 0)
    public amount: string | number = ''

    @IsDateString()
    @Satisfies((value: string) => isBefore(new Date(value), new Date()))
    public date: string = ''

    @IsNumber()
    @Satisfies((value: number) => +value >= 1)
    @Satisfies(isInteger)
    public every: number = 0

    @IsEnum(RecurrenceUnit)
    public recurrenceUnit: string = ''

    @IsNumber(undefined, { each: true })
    @Satisfies((value: number) => +value >= 1, { each: true })
    @Satisfies(isInteger, { each: true })
    public categories: number[] = []

    @Allow()
    public trackerId!: number

    constructor(tracker: Tracker) {
        super()
        this.trackerId = tracker.id
    }

    public transform(): void {
        this.amount = (+this.amount).toFixed(2)
        this.every = Math.floor(+this.every)
    }

    public getRequestBody<CreateTransactionModel>(): CreateTransactionModel {
        const body: any = clone(this)
        body.amount = +body.amount
        return body
    }
}
