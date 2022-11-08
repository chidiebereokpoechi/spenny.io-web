import { validate, ValidationError } from 'class-validator'
import { merge } from 'lodash'
import { BaseModel } from '../../models/request'

const mapErrors = (errors: ValidationError[]): Record<string, string[]> => {
    return errors.reduce((fieldErrors, { property, constraints }) => {
        fieldErrors[property] = Object.values(constraints as Record<string, string>)
        return fieldErrors
    }, {} as Record<string, string[]>)
}

export const validateModel = async <T extends BaseModel = BaseModel>(model: T): Promise<Record<keyof T, string[]>> => {
    model.transform?.()
    const validationErrors = await validate(model, { whitelist: true })
    const customErrors = await model.generateCustomValidation?.()
    const mappedErrors = merge(mapErrors(validationErrors), customErrors ?? {})

    if (process.env.NODE_ENV === 'development') {
        console.log({ errors: mappedErrors, values: { ...model } })
    }

    return mappedErrors as Record<keyof T, string[]>
}
