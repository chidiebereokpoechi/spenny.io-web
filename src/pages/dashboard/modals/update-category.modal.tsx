import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import { FormColorInput, FormTextAreaInput, FormTextInput } from '../../../components/input'
import { CenterModal, ModalProps } from '../../../components/modals'
import { UpdateCategoryModel } from '../../../models/request'
import { Category } from '../../../models/response'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

interface Props extends ModalProps {
    category: Category
}

export const UpdateCategoryModal: React.FC<Props> = observer(({ category, ...props }) => {
    const { categoriesStore } = useStores()
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: UpdateCategoryModel, helpers: FormikHelpers<UpdateCategoryModel>) => {
            helpers.setSubmitting(true)

            categoriesStore.updateCategory(category.id, values).subscribe({
                next(response) {
                    helpers.setSubmitting(false)

                    if (response.data) {
                        close()
                    }
                },
            })
        },
        [categoriesStore, close, category]
    )

    return (
        <CenterModal {...props}>
            <Formik
                enableReinitialize
                initialValues={new UpdateCategoryModel(category)}
                validate={validateModel}
                onSubmit={onSubmit}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[3rem]">
                        <header className="grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Edit category</span>
                            <div>
                                <span>Update the details of your category</span>
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
                                <span>Edit category</span>
                            </PrimaryButton>
                        </footer>
                    </form>
                )}
            </Formik>
        </CenterModal>
    )
})
