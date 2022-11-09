import { entries } from 'lodash'
import { catchError, map, Observable, of } from 'rxjs'
import { ajax, AjaxError } from 'rxjs/ajax'
import { HttpMethod, HttpStatusCode } from './constants'
import { stores } from './stores'

export interface RequestOptions<T> {
    body?: T
    externalDomain?: boolean
    query?: Record<string, number | string>
    withToken?: string
    silentErrors?: boolean
    loadingMessage?: string
    completionMessage?: string
}

export interface Response<T = null> {
    status: number
    ok: boolean
    data: T | null
    message?: string
}

export type ExtendedResponse<T> = Pick<Response<T>, 'status' | 'ok' | 'message'> & T

export const request = <M = any, N = null>(
    endpoint: string,
    method: HttpMethod,
    options?: RequestOptions<M>
): Observable<Response<N>> => {
    let token = stores.authStore.token

    const init: RequestInit = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
        mode: 'cors',
    }

    if (options && 'body' in options && !!options.body) {
        init.body = JSON.stringify(options.body)
    }

    if (options?.withToken !== undefined) {
        token = options.withToken
    }

    if (!!token) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(init.headers as any).Authorization = `Bearer ${token}`
    }

    let url = new URL(process.env.REACT_APP_API_BASE_URL + endpoint).toString()

    if (options?.query) {
        const query = new URLSearchParams()

        entries(options.query).forEach(([key, value]) => {
            query.set(key, '' + value)
        })

        url = `${url}?${query}`
    }

    const requestObservable = ajax({
        url,
        body: init.body,
        method: init.method,
        headers: init.headers,
        withCredentials: true,
    }).pipe(
        catchError((error) => {
            if (error instanceof AjaxError) {
                return of({
                    ...error,
                    response: error.response ?? {
                        data: null,
                        message: error.message,
                    },
                })
            }

            throw error
        }),
        map((response): Response<N> => {
            const ok = response.status >= HttpStatusCode.Ok && response.status < HttpStatusCode.BadRequest

            // if (!ok && !options?.silentErrors) {
            //     appState.createMessage(response.response.message ?? 'Error', MessageType.ERROR)
            // }

            // if (ok && options?.completionMessage) {
            //     appState.createMessage(options.completionMessage, MessageType.SUCCESS)
            // }

            return {
                data: null,
                status: response.status,
                ok,
                message: 'Request complete',
                ...response.response,
            }
        })
    )

    // if (options?.loadingMessage) {
    //     requestObservable = appState.createObservableTask(requestObservable, options.loadingMessage)
    // }

    return requestObservable
}
