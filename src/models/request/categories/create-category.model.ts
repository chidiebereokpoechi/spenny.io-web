import { IsHexColor, MinLength, ValidateIf } from 'class-validator'
import { BaseModel } from '../base.model'

export class CreateCategoryModel extends BaseModel {
    @MinLength(1)
    public label: string = ''

    @ValidateIf((o: CreateCategoryModel) => !!o.description)
    @MinLength(1)
    public description: string = ''

    @IsHexColor()
    public backgroundColor: string = '#334155'

    @IsHexColor()
    public color: string = '#FFFFFF'
}
