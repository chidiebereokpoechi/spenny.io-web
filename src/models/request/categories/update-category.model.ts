import { Allow } from 'class-validator'
import { find } from 'lodash'
import { stores } from '../../../util/stores'
import { Category } from '../../response'
import { BaseModel } from '../base.model'
import { CreateCategoryModel } from './create-category.model'

export class UpdateCategoryModel extends CreateCategoryModel {
    @Allow()
    public readonly id!: number

    constructor(category: Category) {
        super()
        this.id = category.id
        this.label = category.label
        this.description = category.description ?? ''
        this.color = category.color
        this.backgroundColor = category.background_color
    }

    public generateCustomValidation() {
        const categories = stores.categoriesStore.categories
        const errors: Partial<Record<keyof BaseModel, string[]>> = {}
        const existingCategory = find(categories, { label: this.label })

        if (existingCategory && existingCategory.id !== this.id) {
            errors.label = ['Label already exists']
        }

        return errors
    }
}
