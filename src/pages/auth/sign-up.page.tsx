import { Formik, FormikHelpers } from 'formik'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../../components/buttons'
import { FormTextInput } from '../../components/input'
import { SignUpModel } from '../../models/request'
import { RouteLink } from '../../util/constants'
import { useStores } from '../../util/stores'
import { validateModel } from '../../util/validation'

export const SignUpPage: React.FC = () => {
    const { userStore } = useStores()

    const onSubmit = useCallback(
        (values: SignUpModel, helpers: FormikHelpers<SignUpModel>) => {
            helpers.setSubmitting(true)

            userStore.signUp(values).subscribe({
                next() {
                    helpers.setSubmitting(false)
                },
            })
        },
        [userStore]
    )

    return (
        <div className="h-screen w-screen bg-slate-100 flex justify-center items-center">
            <Formik initialValues={new SignUpModel()} validate={validateModel} onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form
                        className="bg-white px-12 py-14 h-full sm:h-auto w-full sm:max-w-[22.5rem] rounded-xl shadow-lg grid grid-cols-1 gap-[3rem]"
                        onSubmit={handleSubmit}
                    >
                        <header className="font-bold text-lg flex justify-center">
                            <span>Create your account</span>
                        </header>
                        <main className="grid grid-cols-1 gap-8">
                            <FormTextInput name="email" label="Email" placeholder="Email" />
                            <FormTextInput name="username" label="Username" placeholder="Username" />
                            <FormTextInput name="password" label="Password" placeholder="Password" type="password" />
                        </main>
                        <footer className="grid grid-cols-1 gap-4 place-items-center">
                            <PrimaryButton type="submit" className="w-full">
                                <span>Start tracking!</span>
                            </PrimaryButton>
                            <Link to={RouteLink.LogIn}>
                                <span>Already have an account?</span>
                            </Link>
                        </footer>
                    </form>
                )}
            </Formik>
        </div>
    )
}
