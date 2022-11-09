import { action, makeAutoObservable, runInAction } from 'mobx'
import { tap } from 'rxjs'
import { CreateCategoryModel, UpdateCategoryModel } from '../models/request'
import { Category } from '../models/response'
import { HttpMethod } from '../util/constants'
import { dehydrateToStorage, hydrateFromStorage, removeFromStorage, Resettable } from '../util/misc'
import { request } from '../util/request'
import { stores } from '../util/stores'

const CATEGORIES_KEY = 'SPENNY.IO:CATEGORIES'

export class CategoriesStore implements Resettable {
    public categories: Category[] = []
    public loading: boolean = false
    public ready: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.setUp()
    }

    @action
    public setUp(): void {
        this.categories = hydrateFromStorage(CATEGORIES_KEY) ?? []
        this.ready = true
    }

    @action
    public listCategories() {
        this.loading = true

        return request<never, Category[]>('/categories', HttpMethod.Get).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.setCategories(response.data)
                    }
                })
            })
        )
    }

    @action
    public createCategory(model: CreateCategoryModel) {
        this.loading = true

        return request<CreateCategoryModel, Category>('/categories', HttpMethod.Post, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listCategories().subscribe()
                    }
                })
            })
        )
    }

    @action
    public updateCategory(id: number, model: UpdateCategoryModel) {
        this.loading = true

        return request<UpdateCategoryModel, Category>(`/categories/${id}`, HttpMethod.Patch, { body: model }).pipe(
            tap((response) => {
                runInAction(() => {
                    this.loading = false

                    if (response.data) {
                        this.listCategories().subscribe()
                    }
                })
            })
        )
    }

    @action
    public setCategories(categories: Category[]): void {
        this.categories = categories
        dehydrateToStorage(CATEGORIES_KEY, categories)
    }

    @action
    public reset(): void {
        this.categories = []
        removeFromStorage(CATEGORIES_KEY)
    }

    @action
    public signOut(): void {
        stores.reset()
    }
}
