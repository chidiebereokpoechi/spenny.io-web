import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateWalletModel, UpdateWalletModel } from '../models/request'
import { Wallet } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { stores } from '../util/stores'

const WALLETS_KEY = 'SPENNY.IO:WALLETS'

export class WalletsStore implements Resettable {
    public wallets: Wallet[] = []
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.wallets = hydrateFromStorage(WALLETS_KEY) ?? []
        this.ready = true
    }

    @action
    public listWallets() {
        this.wallets = []
        this.loading = true

        return request<never, Wallet[]>('/wallets', HttpMethod.Get).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.setWallets(response.data)
                    }
                })
            })
        )
    }

    @action
    public createWallet(model: CreateWalletModel) {
        this.loading = true

        return request<CreateWalletModel, Wallet>('/wallets', HttpMethod.Post, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listWallets().subscribe()
                    }
                })
            })
        )
    }

    @action
    public updateWallet(id: number, model: UpdateWalletModel) {
        this.loading = true

        return request<UpdateWalletModel, Wallet>(`/wallets/${id}`, HttpMethod.Patch, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listWallets().subscribe()
                    }
                })
            })
        )
    }

    @action
    public setWallets(wallets: Wallet[]): void {
        this.wallets = wallets
        dehydrateToStorage(WALLETS_KEY, wallets)
    }

    @action
    public reset(): void {
        this.wallets = []
        this.loading = false
        this.ready = false
        removeFromStorage(WALLETS_KEY)
    }

    @action
    public signOut(): void {
        stores.reset()
    }
}
