'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BottomNav from '../dashboard/components/BottomNav'

export default function SettingsPage() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
        }
        loadUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <main className="min-h-[100dvh] bg-background text-slate-50 pb-24 font-sans">
            <header className="sticky top-0 z-40 px-6 py-5 bg-background/80 backdrop-blur-md border-b border-slate-800/30">
                <h1 className="text-xl font-medium tracking-tight text-slate-50 text-center">Paramètres</h1>
            </header>

            <div className="max-w-lg mx-auto px-6 py-8 space-y-8">
                
                {/* Profil */}
                <section className="bg-surface rounded-2xl p-5 border border-slate-800/50 shadow-sm space-y-4">
                    <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Mon Profil</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl font-medium">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-slate-200 font-medium">{user?.email || 'Chargement...'}</p>
                            <p className="text-slate-500 text-sm">Administrateur</p>
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <section className="bg-surface rounded-2xl p-2 border border-slate-800/50 shadow-sm">
                    <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between p-4 text-rose-400 hover:bg-rose-500/10 transition-colors rounded-xl active:scale-[0.98]"
                    >
                        <span className="font-medium">Se déconnecter</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </section>

                <p className="text-center text-xs text-slate-600 mt-8">Sencaille Finance v1.0.0</p>
            </div>

            <BottomNav />
        </main>
    )
}
