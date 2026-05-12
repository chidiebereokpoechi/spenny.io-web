import { get } from 'lodash'
import { DateTime } from 'luxon'
import { Category } from '../models/response'

export class DomainCategory {
    private readonly id: number
    private readonly label: string
    private readonly description?: string
    private readonly imageUrl?: string
    private readonly backgroundColor: string
    private readonly color: string
    private readonly createdAt: DateTime
    private readonly updatedAt: DateTime

    public get sortableValue(): string {
        return get(this, 'label.0') as string
    }

    constructor(
        id: number,
        label: string,
        description: string | undefined,
        imageUrl: string | undefined,
        backgroundColor: string,
        color: string,
        createdAt: DateTime,
        updatedAt: DateTime
    ) {
        this.id = id
        this.label = label
        this.description = description
        this.imageUrl = imageUrl
        this.backgroundColor = backgroundColor
        this.color = color
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public static fromPlain({
        id,
        label,
        description,
        image_url,
        background_color,
        color,
        created_at,
        updated_at,
    }: Category) {
        return new DomainCategory(
            id,
            label,
            description ?? undefined,
            image_url ?? undefined,
            background_color,
            color,
            DateTime.fromISO(created_at),
            DateTime.fromISO(updated_at)
        )
    }

    public toPlain(): Category {
        return {
            id: this.id,
            label: this.label,
            description: this.description ?? null,
            image_url: this.imageUrl ?? null,
            background_color: this.backgroundColor,
            color: this.color,
            created_at: this.createdAt.toISO(),
            updated_at: this.updatedAt.toISO(),
        }
    }
}
