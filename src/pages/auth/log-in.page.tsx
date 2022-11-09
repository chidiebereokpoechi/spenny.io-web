import { Formik, FormikHelpers } from 'formik'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../../components/buttons'
import { FormTextInput } from '../../components/input'
import { LogInModel } from '../../models/request'
import { RouteLink } from '../../util/constants'
import { useStores } from '../../util/stores'
import { validateModel } from '../../util/validation'

export const LogInPage: React.FC = () => {
    const { authStore: auth } = useStores()

    const onSubmit = useCallback(
        (values: LogInModel, helpers: FormikHelpers<LogInModel>) => {
            helpers.setSubmitting(true)

            auth.logIn(values).subscribe({
                next() {
                    helpers.setSubmitting(false)
                },
            })
        },
        [auth]
    )

    return (
        <div className="h-screen w-screen bg-slate-100 flex justify-center items-center">
            <Formik initialValues={new LogInModel()} validate={validateModel} onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form
                        className="bg-white px-12 py-14 h-full sm:h-auto w-full sm:max-w-[22.5rem] rounded-xl shadow-lg grid grid-cols-1 gap-[3rem]"
                        onSubmit={handleSubmit}
                    >
                        <header className="font-bold text-lg flex justify-center">
                            <span>Log into your account</span>
                        </header>
                        <main className="grid grid-cols-1 gap-8">
                            <FormTextInput
                                name="login"
                                label="Username or password"
                                placeholder="Username or email"
                                type="text"
                            />
                            <FormTextInput name="password" label="Password" placeholder="Password" type="password" />
                        </main>
                        <footer className="grid grid-cols-1 gap-4 place-items-center">
                            <PrimaryButton type="submit" className="w-full">
                                <span>Log in</span>
                            </PrimaryButton>
                            <Link to={RouteLink.SignUp}>
                                <span>Sign up instead?</span>
                            </Link>
                        </footer>
                    </form>
                )}
            </Formik>
        </div>
    )
}
