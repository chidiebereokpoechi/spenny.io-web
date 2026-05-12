import { Allow } from 'class-validator'
import { find } from 'lodash'
import { stores } from '../../../util/stores'
import { Wallet } from '../../response'
import { BaseModel } from '../base.model'
import { CreateWalletModel } from './create-wallet.model'

export class UpdateWalletModel extends CreateWalletModel {
    @Allow()
    public readonly id!: number

    constructor(wallet: Wallet) {
        super()
        this.id = wallet.id
        this.label = wallet.label
        this.color = wallet.color
        this.backgroundColor = wallet.background_color
    }

    public generateCustomValidation() {
        const wallets = stores.walletsStore.wallets
        const errors: Partial<Record<keyof BaseModel, string[]>> = {}
        const existingWallet = find(wallets, { label: this.label })

        if (existingWallet && existingWallet.id !== this.id) {
            errors.label = ['Label already exists']
        }

        return errors
    }
}
