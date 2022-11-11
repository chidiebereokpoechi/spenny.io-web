import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback, useEffect } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import {
    FormCategoriesSelectInput,
    FormDateInput,
    FormNumericalInput,
    FormSelectInput,
    FormTextAreaInput,
    FormTextInput,
} from '../../../components/input'
import { Loader } from '../../../components/layout'
import { ModalProps, SideModal } from '../../../components/modals'
import { CreateTransactionModel } from '../../../models/request'
import { Tracker } from '../../../models/response'
import { recurrenceUnitOptions, transactionTypeOptions } from '../../../util/constants'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

interface Props extends ModalProps {
    tracker: Tracker
}

export const CreateTransactionModal: React.FC<Props> = observer(({ tracker, ...props }) => {
    const { categoriesStore, transactionsStore } = useStores()
    const hasTransactions = transactionsStore.transactions.length > 0
    const submitButtonText = hasTransactions ? 'Create transaction' : 'Create first transaction'
    const setIsOpen = props.setIsOpen
    const categoriesLoading = categoriesStore.loading

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
        <SideModal {...props}>
            <Formik initialValues={new CreateTransactionModel(tracker)} validate={validateModel} onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <Loader loading={categoriesLoading}>
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            <header className="grid grid-cols-1 gap-4 px-12 pt-12 pb-4">
                                <span className="text-3xl font-extrabold text-black">Create a new transaction</span>
                                <div>
                                    <span>Provide information about your transaction</span>
                                </div>
                            </header>
                            <main className="flex flex-col space-y-4 px-12 py-8 overflow-y-auto flex-1">
                                <FormTextInput name="label" label="Label" placeholder="Label: eg. Spotify" />
                                <FormTextAreaInput
                                    name="description"
                                    label="Description"
                                    placeholder="Description (optional): eg. Music streaming service"
                                />
                                <FormSelectInput
                                    name="type"
                                    label="Type"
                                    placeholder="Transaction type"
                                    options={transactionTypeOptions}
                                    accessor={{
                                        display: 'display',
                                        value: 'value',
                                    }}
                                />
                                <FormNumericalInput
                                    name="amount"
                                    label="Amount"
                                    placeholder="Amount: eg. 4.99"
                                    precision={2}
                                />
                                <FormDateInput name="date" label="Date" placeholder="Date: eg. 31st January 2020" />
                                <FormNumericalInput
                                    name="every"
                                    label="Every"
                                    placeholder="Every (how often it recurs): eg. 1"
                                    precision={0}
                                />
                                <FormSelectInput
                                    name="recurrenceUnit"
                                    label="Time unit"
                                    placeholder="Time unit: eg Day, Month"
                                    options={recurrenceUnitOptions}
                                    accessor={{
                                        display: 'display',
                                        value: 'value',
                                    }}
                                />
                                <FormCategoriesSelectInput
                                    name="categories"
                                    label="Categories"
                                    placeholder="Categories (can select multiple or none)"
                                />
                            </main>
                            <footer className="flex-shrink-0 grid grid-cols-1 gap-4 place-items-center px-12 pb-12 pt-4">
                                <PrimaryButton type="submit" className="w-full">
                                    <span>{submitButtonText}</span>
                                </PrimaryButton>
                            </footer>
                        </form>
                    </Loader>
                )}
            </Formik>
        </SideModal>
    )
})
