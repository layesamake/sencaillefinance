'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [pin, setPin] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const PIN_LENGTH = 6

    const handleNumberClick = (num: string) => {
        if (pin.length < PIN_LENGTH) {
            setPin(prev => prev + num)
        }
    }

    const handleBackspace = () => {
        setPin(prev => prev.slice(0, -1))
    }

    // Déclenche automatiquement la connexion si le PIN et l'email sont remplis
    useEffect(() => {
        if (pin.length === PIN_LENGTH && email && !loading) {
            handleLogin()
        }
    }, [pin])

    async function handleLogin(event?: React.FormEvent<HTMLFormElement>) {
        if (event) event.preventDefault()
        if (pin.length < PIN_LENGTH) {
            setErrorMessage(`Le code PIN doit contenir ${PIN_LENGTH} chiffres.`)
            return
        }

        setLoading(true)
        setErrorMessage('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pin,
        })

        if (error) {
            setErrorMessage('Email ou code PIN incorrect.')
            setPin('') // Réinitialise le PIN en cas d'erreur
            setLoading(false)
            return
        }

        router.push('/dashboard')
        router.refresh()
    }

    return (
        <main className="min-h-[100dvh] bg-background text-slate-50 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-sm flex flex-col items-center">
                
                <div className="mb-10 text-center space-y-2">
                    <h1 className="text-2xl font-medium tracking-tight text-slate-50">Sencaille</h1>
                    <p className="text-sm text-slate-400">
                        Entrez votre code confidentiel
                    </p>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-8 flex flex-col items-center">
                    
                    <div className="w-full">
                        <input
                            type="email"
                            required
                            className="w-full rounded-2xl bg-surface/50 border border-slate-800/50 px-5 py-4 text-center outline-none focus:border-emerald-500/50 transition-colors text-slate-200 placeholder:text-slate-500"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Votre email"
                        />
                    </div>

                    {/* Indicateurs de saisie du PIN */}
                    <div className="flex gap-4 my-4">
                        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                            <div 
                                key={i}
                                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                    i < pin.length ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
                                }`}
                            />
                        ))}
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-rose-400 font-medium text-center bg-rose-500/10 px-4 py-2 rounded-lg">
                            {errorMessage}
                        </p>
                    )}

                    {/* Clavier Numérique (Numpad) */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-[280px] mx-auto mt-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => handleNumberClick(num.toString())}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-mono bg-surface hover:bg-slate-800 active:scale-95 transition-all border border-slate-800/30 shadow-sm mx-auto"
                            >
                                {num}
                            </button>
                        ))}
                        <div /> {/* Espace vide en bas à gauche */}
                        <button
                            type="button"
                            onClick={() => handleNumberClick('0')}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-mono bg-surface hover:bg-slate-800 active:scale-95 transition-all border border-slate-800/30 shadow-sm mx-auto"
                        >
                            0
                        </button>
                        <button
                            type="button"
                            onClick={handleBackspace}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-800 active:scale-95 transition-all mx-auto"
                            aria-label="Effacer"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                            </svg>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || pin.length < PIN_LENGTH || !email}
                        className="w-full rounded-full bg-emerald-500 text-slate-950 py-4 font-medium transition-all active:scale-95 disabled:opacity-30 disabled:active:scale-100 mt-6 shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </main>
    )
}