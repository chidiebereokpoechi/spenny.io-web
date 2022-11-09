import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import { FormTextAreaInput, FormTextInput } from '../../../components/input'
import { CenterModal, ModalProps } from '../../../components/modals'
import { UpdateTrackerModel } from '../../../models/request'
import { Tracker } from '../../../models/response'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

interface Props extends ModalProps {
    tracker: Tracker
}

export const UpdateTrackerModal: React.FC<Props> = observer(({ tracker, ...props }) => {
    const { trackersStore } = useStores()
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: UpdateTrackerModel, helpers: FormikHelpers<UpdateTrackerModel>) => {
            helpers.setSubmitting(true)

            trackersStore.updateTracker(tracker.id, values).subscribe({
                next(response) {
                    helpers.setSubmitting(false)

                    if (response.data) {
                        close()
                    }
                },
            })
        },
        [trackersStore, close, tracker]
    )

    return (
        <CenterModal {...props}>
            <Formik initialValues={new UpdateTrackerModel(tracker)} validate={validateModel} onSubmit={onSubmit}>
                {({ dirty, initialValues, isSubmitting, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[3rem]">
                        <header className="grid grid-cols-1 gap-4 overflow-hidden">
                            <span className="text-3xl font-extrabold text-black break-words">
                                Edit {initialValues.label}
                            </span>
                            <div>
                                <span>Update the details of your tracker</span>
                            </div>
                        </header>
                        <main className="grid grid-cols-1 gap-4">
                            <FormTextInput name="label" label="Label" placeholder="Label: eg. Subscriptions" />
                            <FormTextAreaInput
                                name="description"
                                label="Description"
                                placeholder="Description: eg. Tracking my subscriptions"
                            />
                        </main>
                        <footer className="grid grid-cols-1 gap-4 place-items-center">
                            {!dirty && (
                                <PrimaryButton type="button" className="w-full cancel" onClick={close}>
                                    <span>Close</span>
                                </PrimaryButton>
                            )}
                            {dirty && (
                                <PrimaryButton type="submit" className="w-full" loading={isSubmitting}>
                                    <span>Save category</span>
                                </PrimaryButton>
                            )}
                        </footer>
                    </form>
                )}
            </Formik>
        </CenterModal>
    )
})
