import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateTrackerModel, UpdateTrackerModel } from '../models/request'
import { Tracker } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'

const ACTIVE_TRACKER_KEY = 'SPENNY.IO:ACTIVE_TRACKER'
const TRACKERS_KEY = 'SPENNY.IO:TRACKERS'

export class TrackersStore implements Resettable {
    public activeTracker: Tracker | null = null
    public trackers: Tracker[] = []
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.activeTracker = hydrateFromStorage(ACTIVE_TRACKER_KEY)
        this.trackers = hydrateFromStorage(TRACKERS_KEY) ?? []
        this.ready = true
    }

    @action
    public listTrackers() {
        this.loading = true

        return request<never, Tracker[]>('/trackers', HttpMethod.Get).pipe(
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
    public retrieveTracker(id: number) {
        this.ready = false
        this.loading = true

        return request<never, Tracker>(`/trackers/${id}`, HttpMethod.Get).pipe(
            tap((response) => {
                runInAction(() => {
                    this.ready = true
                    this.loading = false

                    if (response.data) {
                        this.setActiveTracker(response.data)
                    }
                })
            })
        )
    }

    @action
    public createTracker(model: CreateTrackerModel) {
        this.loading = true

        return request<CreateTrackerModel, Tracker>('/trackers', HttpMethod.Post, { body: model }).pipe(
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
    public updateTracker(id: number, model: UpdateTrackerModel) {
        this.loading = true

        return request<UpdateTrackerModel, Tracker>(`/trackers/${id}`, HttpMethod.Patch, {
            body: model,
        }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.retrieveTracker(id)
                    }
                })
            })
        )
    }

    @action
    public setActiveTracker(tracker: Tracker): void {
        this.activeTracker = tracker
        dehydrateToStorage(ACTIVE_TRACKER_KEY, tracker)
    }

    @action
    public setTrackers(trackers: Tracker[]): void {
        this.trackers = trackers
        dehydrateToStorage(TRACKERS_KEY, trackers)
    }

    @action
    public reset(): void {
        this.activeTracker = null
        this.trackers = []
        this.ready = false
        this.loading = false
        removeFromStorage(TRACKERS_KEY, ACTIVE_TRACKER_KEY)
    }
}
