export interface Resettable {
    loading: boolean
    ready: boolean
}

export abstract class Resettable {
    public reset(): void {
        // Logic to reset the class
    }
}
