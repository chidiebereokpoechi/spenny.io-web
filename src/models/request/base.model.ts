export abstract class BaseModel {
    [fieldName: string]: any

    // To be called before running validation checks
    public transform?: () => void

    // To be called after validation; before being sent in a request
    public finalize?: () => void

    public getRequestBody?: () => any

    // Used to generate custom validation messages
    public generateCustomValidation?: () => Partial<Record<keyof BaseModel, string[]>>
}
