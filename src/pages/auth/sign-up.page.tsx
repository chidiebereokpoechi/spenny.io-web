import React from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../../components/buttons'
import { TextInput } from '../../components/input'
import { RouteLink } from '../../util/constants'

export const SignUpPage: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-slate-100 flex justify-center items-center">
            <div className="bg-white px-12 py-14 h-full sm:h-auto w-full sm:max-w-[22.5rem] rounded-xl shadow-lg grid grid-cols-1 gap-[3rem]">
                <header className="font-bold text-lg flex justify-center">
                    <span>Create your account</span>
                </header>
                <main className="grid grid-cols-1 gap-8">
                    <TextInput name="email" placeholder="Email" />
                    <TextInput name="username" placeholder="Username" />
                    <TextInput name="password" placeholder="Password" />
                </main>
                <footer className="grid grid-cols-1 gap-4 place-items-center">
                    <PrimaryButton type="submit">
                        <span>Start tracking!</span>
                    </PrimaryButton>
                    <Link to={RouteLink.LOG_IN}>
                        <span>Already have an account?</span>
                    </Link>
                </footer>
            </div>
        </div>
    )
}
