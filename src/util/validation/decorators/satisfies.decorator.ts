import { registerDecorator, ValidationOptions, ValidatorConstraint } from 'class-validator'

export function Satisfies(func: (...args: any[]) => boolean, validationOptions: ValidationOptions) {
    return (object: any, propertyName: any) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [func],
            validator: SatisfiesConstraint,
        })
    }
}

@ValidatorConstraint({ name: 'Satisfies' })
export class SatisfiesConstraint {
    public validate(value: any, args: any): boolean {
        const [func] = args.constraints
        return func(value)
    }
}
