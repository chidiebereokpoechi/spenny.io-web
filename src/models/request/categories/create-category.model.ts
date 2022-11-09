import { IsHexColor, MinLength, ValidateIf } from 'class-validator'
import { find } from 'lodash'
import { stores } from '../../../util/stores'
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
    public color: string = '#F8FAFC'

    public generateCustomValidation() {
        const categories = stores.categoriesStore.categories
        const errors: Partial<Record<keyof BaseModel, string[]>> = {}

        if (find(categories, { label: this.label })) {
            errors.label = ['Label already exists']
        }

        return errors
    }
}
