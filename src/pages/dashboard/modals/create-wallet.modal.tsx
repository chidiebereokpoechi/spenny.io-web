import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import { FormColorInput, FormTextInput } from '../../../components/input'
import { CenterModal, ModalProps } from '../../../components/modals'
import { CreateWalletModel } from '../../../models/request'
import { Wallet } from '../../../models/response'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'
import { ColorPreview } from '../components'

interface Props extends ModalProps {
    onCreate?: (wallet: Wallet) => void
}

export const CreateWalletModal: React.FC<Props> = observer(({ onCreate, ...props }) => {
    const { walletsStore } = useStores()
    const hasWallets = walletsStore.wallets.length > 0
    const submitButtonText = hasWallets ? 'Create wallet' : 'Create first wallet'
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: CreateWalletModel, helpers: FormikHelpers<CreateWalletModel>) => {
            helpers.setSubmitting(true)

            walletsStore.createWallet(values).subscribe({
                next(response) {
                    helpers.setSubmitting(false)

                    if (response.data) {
                        onCreate?.(response.data)
                        close()
                    }
                },
            })
        },
        [walletsStore, close, onCreate]
    )

    return (
        <CenterModal {...props}>
            <Formik initialValues={new CreateWalletModel()} validate={validateModel} onSubmit={onSubmit}>
                {({ isSubmitting, values, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[3rem]">
                        <header className="grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Create a new wallet</span>
                            <div>
                                <span>Wallets show where transactions go into or come out from</span>
                            </div>
                        </header>
                        <main className="grid grid-cols-1 gap-4">
                            <FormTextInput name="label" label="Label" placeholder="Label: eg. Revolut" />
                            <FormColorInput
                                name="backgroundColor"
                                label="Background color"
                                placeholder="Background color"
                            />
                            <FormColorInput name="color" label="Text color" placeholder="Text color" />
                            <ColorPreview
                                label={values.label}
                                color={values.color}
                                backgroundColor={values.backgroundColor}
                            />
                        </main>
                        <footer className="grid grid-cols-1 gap-4 place-items-center">
                            <PrimaryButton type="submit" className="w-full" loading={isSubmitting}>
                                <span>{submitButtonText}</span>
                            </PrimaryButton>
                        </footer>
                    </form>
                )}
            </Formik>
        </CenterModal>
    )
})
