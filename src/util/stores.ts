import { isFunction } from 'formik'
import { forEach, values } from 'lodash'
import { AuthStore } from '../stores'
import { UserStore } from '../stores/user.store'

type Stores = {
    auth: AuthStore
    user: UserStore

    // Store functions
    reset: () => void
}

export const stores: Stores = {
    auth: new AuthStore(),
    user: new UserStore(),

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
