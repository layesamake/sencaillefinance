'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setErrorMessage('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMessage('Email ou mot de passe incorrect.')
            setLoading(false)
            return
        }

        router.push('/dashboard')
        router.refresh()
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 shadow-xl border border-slate-800"
            >
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">SENCAILLE Finance</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Gestion des recettes et dépenses
                    </p>
                </div>

                <label className="block mb-4">
                    <span className="block text-sm mb-1 text-slate-300">Email</span>
                    <input
                        type="email"
                        required
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-emerald-500"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="votre@email.com"
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm mb-1 text-slate-300">
                        Mot de passe
                    </span>
                    <input
                        type="password"
                        required
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-emerald-500"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Votre mot de passe"
                    />
                </label>

                {errorMessage && (
                    <p className="mb-4 rounded-xl bg-red-950 px-4 py-3 text-sm text-red-200">
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-60"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </main>
    )
}