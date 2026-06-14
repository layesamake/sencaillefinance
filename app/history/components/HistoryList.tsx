'use client'

import { useState } from 'react'

export default function HistoryList({ operations }: { operations: any[] }) {
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

    const filteredOperations = operations.filter(op => {
        if (filter === 'all') return true
        return op.operation_type === filter
    })

    return (
        <div className="space-y-6">
            {/* Filtres Rapides */}
            <div className="flex p-1 bg-slate-900 rounded-xl max-w-sm mx-auto">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === 'all' ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    Tout
                </button>
                <button
                    onClick={() => setFilter('income')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    Entrées
                </button>
                <button
                    onClick={() => setFilter('expense')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === 'expense' ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    Sorties
                </button>
            </div>

            {/* Liste des Opérations */}
            <div className="flex flex-col bg-surface rounded-2xl p-4 border border-slate-800/50 shadow-sm">
                {filteredOperations.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm">
                        Aucune opération trouvée.
                    </div>
                ) : (
                    filteredOperations.map((op, index) => {
                        const isIncome = op.operation_type === 'income'
                        const dateFormatee = new Date(op.operation_date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })

                        return (
                            <div key={op.id || index} className={`py-4 flex items-start justify-between ${index !== 0 ? 'border-t border-slate-800/50' : ''}`}>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-slate-200">{op.category_name}</p>
                                    <p className="text-xs text-slate-500">{dateFormatee} • {op.party_name || op.author_name}</p>
                                    {op.description && (
                                        <p className="text-xs text-slate-400 mt-1 italic">"{op.description}"</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium font-mono ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                                        {isIncome ? '+' : '-'}{Number(op.total_amount).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
