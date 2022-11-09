import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import { FormSelectInput, FormTextAreaInput, FormTextInput } from '../../../components/input'
import { CenterModal, ModalProps } from '../../../components/modals'
import { CreateTransactionModel } from '../../../models/request'
import { Tracker } from '../../../models/response'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

interface Props extends ModalProps {
    tracker: Tracker
}

export const CreateTransactionModal: React.FC<Props> = observer(({ tracker, ...props }) => {
    const { categoriesStore, transactionsStore } = useStores()
    const categories = categoriesStore.categories
    const hasTransactions = transactionsStore.transactions.length > 0
    const submitButtonText = hasTransactions ? 'Create transaction' : 'Create first transaction'
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: CreateTransactionModel, helpers: FormikHelpers<CreateTransactionModel>) => {
            helpers.setSubmitting(true)

            transactionsStore.createTransaction(values).subscribe({
                next(response) {
                    helpers.setSubmitting(false)

                    if (response.data) {
                        close()
                    }
                },
            })
        },
        [transactionsStore, close]
    )

    useEffect(() => {
        const subscription = categoriesStore.listCategories().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [categoriesStore])

    return (
        <CenterModal {...props}>
            <Formik initialValues={new CreateTransactionModel(tracker)} validate={validateModel} onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[3rem]">
                        <header className="grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Create a new transaction</span>
                            <div>
                                <span>Provide information about your transaction</span>
                            </div>
                        </header>
                        <main className="grid grid-cols-1 gap-4">
                            <FormTextInput name="label" label="Label" placeholder="Label: eg. Subscriptions" />
                            <FormTextAreaInput
                                name="description"
                                label="Description"
                                placeholder="Description: eg. Tracking my subscriptions"
                            />
                            <FormTextInput name="amount" label="Amount" placeholder="Amount: eg. 4.99" type="number" />
                            <FormTextInput name="date" label="Date" placeholder="Date: eg. 31/01/1999" type="date" />
                            <FormTextInput name="every" label="Every" placeholder="Every: eg. 1" type="number" />
                            <FormSelectInput
                                name="categories"
                                label="Categories"
                                placeholder="Categories"
                                multiple
                                options={categories}
                                accessor={{
                                    display: 'label',
                                    value: 'id',
                                }}
                            />
                        </main>
                        <footer className="grid grid-cols-1 gap-4 place-items-center">
                            <PrimaryButton type="submit" className="w-full">
                                <span>{submitButtonText}</span>
                            </PrimaryButton>
                        </footer>
                    </form>
                )}
            </Formik>
        </CenterModal>
    )
})
