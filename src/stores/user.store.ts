import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { LogInModel, SignUpModel } from '../models/request'
import { User } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { stores } from '../util/stores'

const USER_KEY = 'SPENNY.IO:USER'

export class UserStore implements Resettable {
    public user!: User | null
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.user = hydrateFromStorage(USER_KEY)
        this.ready = true
    }

    @action
    public getAuthenticatedUser() {
        this.loading = true

        return request<never, User>('/users/info', HttpMethod.Get).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.setUser(response.data)
                    }
                })
            })
        )
    }

    @action
    public signUp(model: SignUpModel) {
        return request<SignUpModel, User>('/users', HttpMethod.Post, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    if (response.data) {
                        const login = new LogInModel()
                        login.login = model.username
                        login.password = model.password

                        stores.authStore.logIn(login).subscribe()
                    }
                })
            })
        )
    }

    @action
    public setUser(user: User): void {
        this.user = user
        dehydrateToStorage(USER_KEY, user)

        if (this.user?.trackers) {
            stores.trackersStore.setTrackers(this.user.trackers)
        }
    }

    @action
    public reset(): void {
        this.user = null
        removeFromStorage(USER_KEY)
    }

    @action
    public signOut(): void {
        stores.reset()
    }
}
