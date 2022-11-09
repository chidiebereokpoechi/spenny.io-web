import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateTrackerModel } from '../models/request'
import { Tracker } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { stores } from '../util/stores'

const TRACKERS_KEY = 'SPENNY.IO:TRACKERS'

export class TrackersStore implements Resettable {
    public trackers: Tracker[] = []
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.trackers = hydrateFromStorage(TRACKERS_KEY) ?? []
        this.ready = true
    }

    @action
    public listTrackers() {
        this.loading = true

        return request<never, Tracker[]>('/trackers', HttpMethod.GET).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.setTrackers(response.data)
                    }
                })
            })
        )
    }

    @action
    public createTracker(model: CreateTrackerModel) {
        this.loading = true

        return request<CreateTrackerModel, Tracker>('/trackers', HttpMethod.POST, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listTrackers().subscribe()
                    }
                })
            })
        )
    }

    @action
    public setTrackers(trackers: Tracker[]): void {
        this.trackers = trackers
        dehydrateToStorage(TRACKERS_KEY, trackers)
    }

    @action
    public reset(): void {
        this.trackers = []
        removeFromStorage(TRACKERS_KEY)
    }

    @action
    public signOut(): void {
        stores.reset()
    }
}
