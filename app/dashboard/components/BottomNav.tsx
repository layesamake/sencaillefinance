'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import TransactionDrawer from './TransactionDrawer'

interface BottomNavProps {
    categories?: any[]
    accounts?: any[]
    parties?: any[]
}

export default function BottomNav({ categories = [], accounts = [], parties = [] }: BottomNavProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const supabase = createClient()
    const pathname = usePathname()

    const handleSignOutClick = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    // Fonction d'aide pour déterminer la couleur d'une icône
    const getIconColor = (path: string) => {
        return pathname === path ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
    }

    return (
        <>
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface/90 backdrop-blur-xl border border-slate-800/50 px-4 py-2 flex items-center justify-between w-[92%] max-w-sm rounded-full shadow-2xl">
                
                <Link href="/dashboard" className={`p-3 flex items-center justify-center transition-colors active:scale-95 ${getIconColor('/dashboard')}`} aria-label="Accueil">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </Link>
                
                <Link href="/history" className={`p-3 flex items-center justify-center transition-colors active:scale-95 ${getIconColor('/history')}`} aria-label="Historique">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </Link>
                
                {/* FAB */}
                <div className="relative -top-5">
                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_8px_30px_rgb(16,185,129,0.3)] transition-transform active:scale-95 hover:bg-emerald-400" 
                        aria-label="Saisir"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <button className={`p-3 flex items-center justify-center transition-colors active:scale-95 text-slate-400 hover:text-slate-200`} aria-label="Rapports">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                
                <button onClick={handleSignOutClick} className="p-3 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors active:scale-95" aria-label="Déconnexion">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </nav>

            <TransactionDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                categories={categories}
                accounts={accounts}
                parties={parties}
            />
        </>
    )
}
