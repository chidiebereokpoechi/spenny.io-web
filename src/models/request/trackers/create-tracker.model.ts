import { MinLength } from 'class-validator'
import { BaseModel } from '../base.model'

export class CreateTrackerModel extends BaseModel {
    @MinLength(1)
    public label: string = ''

    @MinLength(1)
    public description: string = ''
}
