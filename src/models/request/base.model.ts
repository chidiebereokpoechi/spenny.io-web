export abstract class BaseModel {
    [fieldName: string]: any

    // To be called before running validation checks
    public transform?(): void

    // Used to generate custom validation messages
    public generateCustomValidation?(): Partial<Record<keyof BaseModel, string[]>>

    // Generate a special payload for use in requests
    public getRequestBody?<T>(): T
}
