import { isFunction } from 'formik'
import { forEach, values } from 'lodash'
import { AuthStore, CategoriesStore, TrackersStore, UserStore } from '../stores'

type Stores = {
    authStore: AuthStore
    categoriesStore: CategoriesStore
    trackersStore: TrackersStore
    userStore: UserStore

    // Store functions
    reset: () => void
}

export const stores: Stores = {
    authStore: new AuthStore(),
    categoriesStore: new CategoriesStore(),
    trackersStore: new TrackersStore(),
    userStore: new UserStore(),

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
