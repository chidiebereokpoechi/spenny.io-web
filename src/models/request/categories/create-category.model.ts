import { IsHexColor, MinLength, ValidateIf } from 'class-validator'
import { find } from 'lodash'
import { stores } from '../../../util/stores'
import { BaseModel } from '../base.model'

const DEFAULT_BACKGROUND_COLOR = '#334155'
const DEFAULT_COLOR = '#F8FAFC'

export class CreateCategoryModel extends BaseModel {
    @MinLength(1)
    public label: string = ''

    @ValidateIf((o: CreateCategoryModel) => !!o.description)
    @MinLength(1)
    public description: string = ''

    @IsHexColor()
    public backgroundColor: string = DEFAULT_BACKGROUND_COLOR

    @IsHexColor()
    public color: string = DEFAULT_COLOR

    public generateCustomValidation() {
        const categories = stores.categoriesStore.categories
        const errors: Partial<Record<keyof BaseModel, string[]>> = {}

        if (find(categories, { label: this.label })) {
            errors.label = ['Label already exists']
        }

        return errors
    }
}
