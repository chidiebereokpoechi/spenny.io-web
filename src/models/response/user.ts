import { Category } from './category'
import { Tracker } from './tracker'

export interface User {
    id: number
    username: string
    email: string
    image_url: string | null
    trackers: Tracker[]
    categories: Category[]
    created_at: string
    updated_at: string
}
