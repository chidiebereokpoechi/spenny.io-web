export const hydrateFromStorage = <T>(key: string, failSilently: boolean = true): T | null => {
    try {
        const stringRep = localStorage.getItem(key)

        if (!stringRep) {
            throw new Error(`No element at key "${key}"`)
        }

        const item: T = JSON.parse(stringRep)
        return item
    } catch (e) {
        if (failSilently) {
            return null
        }

        throw e
    }
}

export const dehydrateToStorage = <T>(key: string, item: T): void => {
    localStorage.setItem(key, JSON.stringify(item))
}

export const removeFromStorage = (...keys: string[]): void => {
    keys.forEach((key) => localStorage.removeItem(key))
}
