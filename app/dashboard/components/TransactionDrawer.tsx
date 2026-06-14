'use client'

import { useState, useEffect } from 'react'
import { addOperation } from '../actions'

interface TransactionDrawerProps {
    isOpen: boolean
    onClose: () => void
    categories?: any[]
    accounts?: any[]
    parties?: any[]
}

export default function TransactionDrawer({ isOpen, onClose, categories = [], accounts = [], parties = [] }: TransactionDrawerProps) {
    const [type, setType] = useState<'income' | 'expense'>('income')
    const [amount, setAmount] = useState('')
    
    // On sépare les catégories selon le type (si la colonne `type` existe, sinon on prend tout)
    const incomeCategories = categories.filter(c => c.type === 'income' || !c.type)
    const expenseCategories = categories.filter(c => c.type === 'expense' || !c.type)

    const currentCategories = type === 'income' ? incomeCategories : expenseCategories

    const [category, setCategory] = useState(currentCategories[0]?.id || '')
    const [account, setAccount] = useState(accounts[0]?.id || '')
    const [party, setParty] = useState('') // Optionnel
    const [description, setDescription] = useState('')
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Reset les sélections si le type change ou si les props changent
    useEffect(() => {
        setCategory(currentCategories[0]?.id || '')
    }, [type, categories]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (accounts.length > 0 && !account) {
            setAccount(accounts[0].id)
        }
    }, [accounts]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setIsSubmitting(true)
        
        const formData = new FormData()
        formData.append('operation_type', type)
        formData.append('total_amount', amount)
        formData.append('category_id', category)
        formData.append('initial_account_id', account)
        if (party) formData.append('party_id', party)
        if (description) formData.append('description', description)

        const result = await addOperation(formData)

        setIsSubmitting(false)

        if (!result.success) {
            setErrorMsg(result.error || "Erreur inconnue")
        } else {
            // Succès ! On réinitialise et on ferme
            setAmount('')
            setDescription('')
            setParty('')
            onClose()
        }
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

                {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Sélecteur Entrée / Sortie */}
                    <div className="flex p-1 bg-slate-950 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                type === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Entrée
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
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
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-slate-600 appearance-none"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="" disabled>Sélectionner une catégorie</option>
                            {currentCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Compte */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Compte</label>
                            <select
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-slate-600 appearance-none"
                                value={account}
                                onChange={e => setAccount(e.target.value)}
                            >
                                <option value="" disabled>Compte</option>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tiers (Client/Fournisseur) */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Tiers (Optionnel)</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-slate-600 appearance-none"
                                value={party}
                                onChange={e => setParty(e.target.value)}
                            >
                                <option value="">Aucun tiers</option>
                                {parties.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
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
                        disabled={isSubmitting || !amount || !category || !account}
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
