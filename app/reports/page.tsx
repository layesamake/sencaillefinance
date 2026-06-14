import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '../dashboard/components/BottomNav'

export default async function ReportsPage() {
    const supabase = await createClient()

    // 1. Vérification session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch data (Mois en cours)
    let operations = []
    let categories = []
    let accounts = []
    let parties = []

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    const yyyymmdd = startOfMonth.toISOString().split('T')[0]

    try {
        const [opsRes, catsRes, accsRes, ptsRes] = await Promise.all([
            supabase.from('operation_payment_summary').select('*').gte('operation_date', yyyymmdd),
            supabase.from('categories').select('id, name, type'),
            supabase.from('accounts').select('id, name'),
            supabase.from('parties').select('id, name')
        ])

        if (opsRes.data) operations = opsRes.data
        if (catsRes.data) categories = catsRes.data
        if (accsRes.data) accounts = accsRes.data
        if (ptsRes.data) parties = ptsRes.data
    } catch (e) {
        console.error("Erreur de chargement des rapports", e)
    }

    // Mock si vide
    if (operations.length === 0) {
        operations = [
            { operation_type: 'income', category_name: 'Vente œufs', total_amount: 120000 },
            { operation_type: 'income', category_name: 'Vente cailleteaux', total_amount: 45000 },
            { operation_type: 'expense', category_name: 'Aliment', total_amount: 80000 },
            { operation_type: 'expense', category_name: 'Transport', total_amount: 15000 },
            { operation_type: 'expense', category_name: 'Frais vétérinaires', total_amount: 10000 }
        ]
    }

    // 3. Calculs des totaux
    let totalIncome = 0
    let totalExpense = 0
    const incomeByCategory: Record<string, number> = {}
    const expenseByCategory: Record<string, number> = {}

    operations.forEach(op => {
        const amount = Number(op.total_amount)
        const catName = op.category_name || 'Autre'

        if (op.operation_type === 'income') {
            totalIncome += amount
            incomeByCategory[catName] = (incomeByCategory[catName] || 0) + amount
        } else if (op.operation_type === 'expense') {
            totalExpense += amount
            expenseByCategory[catName] = (expenseByCategory[catName] || 0) + amount
        }
    })

    const netResult = totalIncome - totalExpense

    // Tri des catégories par montant décroissant
    const sortedIncomes = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1])
    const sortedExpenses = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])

    return (
        <main className="min-h-[100dvh] bg-background text-slate-50 pb-24 font-sans">
            <header className="sticky top-0 z-40 px-6 py-5 bg-background/80 backdrop-blur-md border-b border-slate-800/30">
                <h1 className="text-xl font-medium tracking-tight text-slate-50 text-center">Rapports du mois</h1>
            </header>

            <div className="max-w-lg mx-auto px-6 py-8 space-y-10">
                
                {/* Résultat Net */}
                <section className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center shadow-lg">
                    <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Résultat Net</p>
                    <p className={`text-4xl font-mono font-medium ${netResult >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {netResult > 0 ? '+' : ''}{netResult.toLocaleString('fr-FR')} <span className="text-lg font-sans">FCFA</span>
                    </p>
                    
                    <div className="flex justify-between mt-6 text-sm">
                        <div className="flex flex-col">
                            <span className="text-slate-500">Entrées</span>
                            <span className="font-mono text-emerald-400">{totalIncome.toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="w-px bg-slate-800 mx-4"></div>
                        <div className="flex flex-col text-right">
                            <span className="text-slate-500">Sorties</span>
                            <span className="font-mono text-rose-400">{totalExpense.toLocaleString('fr-FR')}</span>
                        </div>
                    </div>
                </section>

                {/* Dépenses par catégorie */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Dépenses par catégorie
                    </h2>
                    
                    <div className="bg-surface rounded-2xl p-5 border border-slate-800/50 space-y-5 shadow-sm">
                        {sortedExpenses.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-2">Aucune sortie ce mois-ci.</p>
                        ) : (
                            sortedExpenses.map(([cat, amount], index) => {
                                const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
                                return (
                                    <div key={index} className="space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-200">{cat}</span>
                                            <span className="font-mono text-slate-300">{amount.toLocaleString('fr-FR')}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-mono text-slate-500 w-8 text-right">{percentage}%</span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>

                {/* Revenus par catégorie */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Revenus par catégorie
                    </h2>
                    
                    <div className="bg-surface rounded-2xl p-5 border border-slate-800/50 space-y-5 shadow-sm">
                        {sortedIncomes.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-2">Aucune entrée ce mois-ci.</p>
                        ) : (
                            sortedIncomes.map(([cat, amount], index) => {
                                const percentage = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0
                                return (
                                    <div key={index} className="space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-200">{cat}</span>
                                            <span className="font-mono text-slate-300">{amount.toLocaleString('fr-FR')}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-mono text-slate-500 w-8 text-right">{percentage}%</span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>
            </div>

            <BottomNav categories={categories} accounts={accounts} parties={parties} />
        </main>
    )
}
