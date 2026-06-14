'use client'

import { useState } from 'react'

interface TransactionDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const CATEGORIES_INCOME = ['Vente œufs', 'Vente cailleteaux', 'Vente viande', 'Autre entrée']
const CATEGORIES_EXPENSE = ['Aliment', 'Transport', 'Matériel', 'Frais vétérinaires', 'Autre sortie']

export default function TransactionDrawer({ isOpen, onClose }: TransactionDrawerProps) {
    const [type, setType] = useState<'income' | 'expense'>('income')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState(CATEGORIES_INCOME[0])
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Gère le basculement entre entrée et sortie
    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType)
        setCategory(newType === 'income' ? CATEGORIES_INCOME[0] : CATEGORIES_EXPENSE[0])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulation d'une sauvegarde
        await new Promise(resolve => setTimeout(resolve, 800))
        
        console.log({ type, amount, category, description })
        
        // Réinitialisation
        setAmount('')
        setDescription('')
        setIsSubmitting(false)
        onClose()
    }

    // Styles conditionnels pour l'animation
    const drawerStyles = isOpen 
        ? "translate-y-0 opacity-100 pointer-events-auto" 
        : "translate-y-full opacity-0 pointer-events-none"
    
    const backdropStyles = isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"

    return (
        <>
            {/* Backdrop sombre */}
            <div 
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${backdropStyles}`}
                onClick={onClose}
            />

            {/* Le Tiroir (Drawer) */}
            <div 
                className={`fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl border-t border-slate-800/50 p-6 pt-4 transition-all duration-300 transform ${drawerStyles} shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`}
                onClick={e => e.stopPropagation()} // Empêche la fermeture au clic sur le tiroir
            >
                {/* Poignée de glissement visuelle */}
                <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-slate-50 font-sans">Nouvelle saisie</h2>
                    <button 
                        onClick={onClose}
                        type="button"
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-800 active:scale-95"
                        aria-label="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Sélecteur Entrée / Sortie */}
                    <div className="flex p-1 bg-slate-950 rounded-xl">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('income')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                type === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Entrée
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('expense')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                type === 'expense' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Sortie
                        </button>
                    </div>

                    {/* Montant (Grand champ centré) */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Montant (FCFA)</label>
                        <input
                            type="number"
                            required
                            placeholder="0"
                            className={`w-full bg-slate-950 border ${type === 'income' ? 'border-emerald-500/30 focus:border-emerald-500' : 'border-rose-500/30 focus:border-rose-500'} rounded-2xl px-6 py-4 text-3xl font-mono font-medium text-slate-50 outline-none transition-colors placeholder:text-slate-700`}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Catégorie</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-slate-600 appearance-none"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {(type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description optionnelle */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Note (Optionnelle)</label>
                        <input
                            type="text"
                            placeholder="Ex: Vente marché central"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-slate-600 placeholder:text-slate-600"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !amount}
                        className={`w-full py-4 rounded-xl font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
                            type === 'income' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                        }`}
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Valider l\'opération'}
                    </button>
                </form>
            </div>
        </>
    )
}
