import { Tracker } from '../../response'
import { CreateCategoryModel } from '../categories'

export class UpdateTrackerModel extends CreateCategoryModel {
    constructor(tracker: Tracker) {
        super()
        this.label = tracker.label
        this.description = tracker.description ?? ''
    }
}
