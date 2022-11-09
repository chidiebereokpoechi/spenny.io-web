import { Category } from '../../response'
import { CreateCategoryModel } from './create-category.model'

export class UpdateCategoryModel extends CreateCategoryModel {
    constructor(category: Category) {
        super()
        this.label = category.label
        this.description = category.description ?? ''
        this.color = category.color
        this.backgroundColor = category.background_color
    }
}
