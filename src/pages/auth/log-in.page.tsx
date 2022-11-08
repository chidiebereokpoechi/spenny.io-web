import React from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../../components/buttons'
import { TextInput } from '../../components/input'
import { RouteLink } from '../../util/constants'

export const LogInPage: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-slate-100 flex justify-center items-center">
            <div className="bg-white px-12 py-14 h-full sm:h-auto w-full sm:max-w-[22.5rem] rounded-xl shadow-lg grid grid-cols-1 gap-[3rem]">
                <header className="font-bold text-lg flex justify-center">
                    <span>Log into your account</span>
                </header>
                <main className="grid grid-cols-1 gap-8">
                    <TextInput name="login" label="Login" placeholder="username or email" />
                    <TextInput name="password" label="Password" placeholder="password" />
                </main>
                <footer className="text-sm grid grid-cols-1 gap-4 place-items-center">
                    <PrimaryButton type="submit">
                        <span>Log in</span>
                    </PrimaryButton>
                    <Link to={RouteLink.SIGN_UP}>
                        <span>Sign up instead?</span>
                    </Link>
                </footer>
            </div>
        </div>
    )
}
