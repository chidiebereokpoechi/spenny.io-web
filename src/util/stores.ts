import { isFunction } from 'formik'
import { forEach, values } from 'lodash'
import { AuthStore, CategoriesStore, TrackersStore, TransactionsStore, UserStore } from '../stores'

type Stores = {
    authStore: AuthStore
    categoriesStore: CategoriesStore
    trackersStore: TrackersStore
    transactionsStore: TransactionsStore
    userStore: UserStore

    // Store functions
    reset: () => void
}

export const stores: Stores = {
    authStore: new AuthStore(),
    categoriesStore: new CategoriesStore(),
    trackersStore: new TrackersStore(),
    transactionsStore: new TransactionsStore(),
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
