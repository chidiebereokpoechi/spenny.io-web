import { Formik, FormikHelpers } from 'formik'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PrimaryButton } from '../../../components/buttons'
import { FormTextAreaInput, FormTextInput } from '../../../components/input'
import { CenterModal, ModalProps } from '../../../components/modals'
import { CreateTrackerModel } from '../../../models/request'
import { useStores } from '../../../util/stores'
import { validateModel } from '../../../util/validation'

export const CreateTrackerModal: React.FC<ModalProps> = observer((props) => {
    const { trackers: trackersStore } = useStores()
    const hasTrackers = trackersStore.trackers.length > 0
    const submitButtonText = hasTrackers ? 'Create tracker' : 'Create first tracker'
    const setIsOpen = props.setIsOpen

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSubmit = useCallback(
        (values: CreateTrackerModel, helpers: FormikHelpers<CreateTrackerModel>) => {
            helpers.setSubmitting(true)

            trackersStore.createTracker(values).subscribe({
                next() {
                    helpers.setSubmitting(false)
                    close()
                },
            })
        },
        [trackersStore, close]
    )

    return (
        <CenterModal {...props}>
            <Formik initialValues={new CreateTrackerModel()} validate={validateModel} onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[3rem]">
                        <header className="grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Create a new tracker</span>
                            <div>
                                <span>Trackers are buckets to separate your transactions</span>
                            </div>
                        </header>
                        <main className="grid grid-cols-1 gap-4">
                            <FormTextInput name="label" placeholder="Label" />
                            <FormTextAreaInput name="description" placeholder="Description" />
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
