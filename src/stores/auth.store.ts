import { action, computed, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { LogInModel } from '../models/request'
import { AuthResponse } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { stores } from '../util/stores'

const AUTH_KEY = 'SPENNY.IO:AUTH'

export class AuthStore implements Resettable {
    public authResponse!: AuthResponse | null
    public ready = false

    @computed
    public get authenticated() {
        return !!this.authResponse?.token
    }

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
    public logIn(model: LogInModel) {
        return request<LogInModel, AuthResponse>('/auth', HttpMethod.POST, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    if (response.data) {
                        this.authResponse = response.data
                    }
                })
            })
        )
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
