import { isFunction } from 'formik'
import { forEach, values } from 'lodash'
import { AuthStore, TrackersStore, UserStore } from '../stores'

type Stores = {
    auth: AuthStore
    trackers: TrackersStore
    user: UserStore

    // Store functions
    reset: () => void
}

export const stores: Stores = {
    auth: new AuthStore(),
    trackers: new TrackersStore(),
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
