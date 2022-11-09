import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import { FormColorInput, FormTextAreaInput, FormTextInput } from '../../../components/input'
import { CenterModal, ModalProps } from '../../../components/modals'
import { CreateCategoryModel } from '../../../models/request'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

export const CreateCategoryModal: React.FC<ModalProps> = observer((props) => {
    const { categoriesStore } = useStores()
    const hasCategories = categoriesStore.categories.length > 0
    const submitButtonText = hasCategories ? 'Create category' : 'Create first category'
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: CreateCategoryModel, helpers: FormikHelpers<CreateCategoryModel>) => {
            helpers.setSubmitting(true)

            categoriesStore.createCategory(values).subscribe({
                next(response) {
                    helpers.setSubmitting(false)

                    if (response.data) {
                        close()
                    }
                },
            })
        },
        [categoriesStore, close]
    )

    return (
        <CenterModal {...props}>
            <Formik initialValues={new CreateCategoryModel()} validate={validateModel} onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[3rem]">
                        <header className="grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Create a new category</span>
                            <div>
                                <span>Categories are helpful tags you can put on your transactions</span>
                            </div>
                        </header>
                        <main className="grid grid-cols-1 gap-4">
                            <FormTextInput name="label" label="Label" placeholder="Label: eg. Finance" />
                            <FormTextAreaInput
                                name="description"
                                label="Description"
                                placeholder="Description (optional): eg. Transactions related to finance"
                            />
                            <FormColorInput name="color" label="Text color" placeholder="Text color" />
                            <FormColorInput
                                name="backgroundColor"
                                label="Background color"
                                placeholder="Background color"
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
