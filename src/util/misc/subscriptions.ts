import { Subscription } from 'rxjs'

export const cancelSubscriptions = (subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription) => subscription.unsubscribe())
}
