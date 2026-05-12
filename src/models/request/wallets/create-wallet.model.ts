import { IsHexColor, MinLength } from 'class-validator'
import { find } from 'lodash'
import { stores } from '../../../util/stores'
import { BaseModel } from '../base.model'

const DEFAULT_BACKGROUND_COLOR = '#334155'
const DEFAULT_COLOR = '#F8FAFC'

export class CreateWalletModel extends BaseModel {
    @MinLength(1)
    public label: string = ''

    @IsHexColor()
    public backgroundColor: string = DEFAULT_BACKGROUND_COLOR

    @IsHexColor()
    public color: string = DEFAULT_COLOR

    public generateCustomValidation() {
        const wallets = stores.walletsStore.wallets
        const errors: Partial<Record<keyof BaseModel, string[]>> = {}

        if (find(wallets, { label: this.label })) {
            errors.label = ['Label already exists']
        }

        return errors
    }
}
