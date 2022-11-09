import { action, computed, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { LogInModel } from '../models/request'
import { AuthResponse } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { stores } from '../util/stores'

const API_TOKEN_KEY = 'SPENNY.IO:API_TOKEN'

export class AuthStore implements Resettable {
    public token: string | null = null
    public loading: boolean = false
    public ready = false

    @computed
    public get authenticated() {
        return !!this.token
    }

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.token = hydrateFromStorage(API_TOKEN_KEY)
        this.ready = true
    }

    @action
    public logIn(model: LogInModel) {
        return request<LogInModel, AuthResponse>('/auth', HttpMethod.Post, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    if (response.data) {
                        this.setToken(response.data.token)
                        stores.userStore.setUser(response.data.user)
                    }
                })
            })
        )
    }

    @action
    public setToken(token: string): void {
        this.token = token
        dehydrateToStorage(API_TOKEN_KEY, token)
    }

    @action
    public reset(): void {
        this.token = null
        removeFromStorage(API_TOKEN_KEY)
    }

    @action
    public signOut(): void {
        stores.reset()
    }
}
