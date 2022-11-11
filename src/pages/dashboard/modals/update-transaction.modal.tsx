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
import { UpdateTransactionModel } from '../../../models/request'
import { Tracker, Transaction } from '../../../models/response'
import { recurrenceUnitOptions, transactionTypeOptions } from '../../../util/constants'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

interface Props extends ModalProps {
    tracker: Tracker
    transaction: Transaction
}

export const UpdateTransactionModal: React.FC<Props> = observer(({ tracker, transaction, ...props }) => {
    const { categoriesStore, transactionsStore } = useStores()
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: UpdateTransactionModel, helpers: FormikHelpers<UpdateTransactionModel>) => {
            helpers.setSubmitting(true)

            transactionsStore.updateTransaction(transaction.id, values).subscribe({
                next(response) {
                    helpers.setSubmitting(false)

                    if (response.data) {
                        close()
                    }
                },
            })
        },
        [transactionsStore, close, transaction]
    )

    useEffect(() => {
        const subscription = categoriesStore.listCategories().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [categoriesStore])

    return (
        <SideModal {...props}>
            <Formik
                initialValues={new UpdateTransactionModel(transaction, tracker)}
                validate={validateModel}
                onSubmit={onSubmit}
            >
                {({ dirty, initialValues, isSubmitting, handleSubmit }) => (
                    <Loader loading={categoriesStore.loading}>
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            <header className="grid grid-cols-1 gap-4 overflow-hidden px-12 pt-12 pb-4">
                                <span className="text-3xl font-extrabold text-black break-words">
                                    Edit {initialValues.label}
                                </span>
                                <div>
                                    <span>Update the details of your transaction</span>
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
                                {!dirty && (
                                    <PrimaryButton type="button" className="w-full cancel" onClick={close}>
                                        <span>Close</span>
                                    </PrimaryButton>
                                )}
                                {dirty && (
                                    <PrimaryButton type="submit" className="w-full" loading={isSubmitting}>
                                        <span>Save transaction</span>
                                    </PrimaryButton>
                                )}
                            </footer>
                        </form>
                    </Loader>
                )}
            </Formik>
        </SideModal>
    )
})
