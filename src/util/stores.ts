import { isFunction } from 'formik'
import { forEach, values } from 'lodash'
import { AuthStore } from '../stores'

type Stores = {
    auth: AuthStore

    // Store functions
    reset: () => void
}

export const stores: Stores = {
    auth: new AuthStore(),

    reset(): void {
        forEach(values(this), (value: any) => {
            const reset = value.reset

            if (reset && isFunction(reset)) {
                reset()
            }
        })
    },
}

export const useStores = () => {
    return stores
}
