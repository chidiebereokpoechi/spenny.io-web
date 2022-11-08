import { action, makeAutoObservable } from 'mobx'
import { AuthResponse } from '../models/response'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { stores } from '../util/stores'

const AUTH_KEY = 'SPENNY.IO:AUTH'

export class AuthStore implements Resettable {
    public authResponse!: AuthResponse | null
    public ready = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.authResponse = hydrateFromStorage(AUTH_KEY)
        this.ready = true
    }

    @action
    public setAuthResponse(authResponse: AuthResponse): void {
        this.authResponse = authResponse
        dehydrateToStorage(AUTH_KEY, authResponse)
    }

    @action
    public reset(): void {
        this.authResponse = null
        removeFromStorage(AUTH_KEY)
    }

    @action
    public signOut(): void {
        stores.reset()
    }
}
