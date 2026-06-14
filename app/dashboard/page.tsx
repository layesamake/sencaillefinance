import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Action serveur pour se déconnecter
async function handleSignOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Récupération de la session utilisateur
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Récupération du profil
    let profile = {
        full_name: 'Utilisateur',
        role: 'user',
        status: 'active'
    }

    try {
        const { data: pData } = await supabase
            .from('profiles')
            .select('id, full_name, role, status')
            .eq('id', user.id)
            .single()
        
        if (pData) {
            profile = pData
        }
    } catch (e) {
        console.warn("Erreur de récupération du profil, utilisation des données de session.", e)
    }

    if (profile.status !== 'active') {
        redirect('/login')
    }

    // 3. Récupération des données financières réelles ou fallbacks (mock data)
    let waveBalance = 325000
    let cashBalance = 75000
    let monthlyIncome = 150000
    let monthlyExpense = 25000
    let clientDebt = 30000
    let supplierDebt = 5000

    let latestOperations = [
        {
            id: '1',
            operation_type: 'income',
            category_name: 'Vente œufs de caille',
            party_name: null,
            total_amount: 20000,
            total_paid: 20000,
            remaining_amount: 0,
            computed_payment_status: 'paid',
            settlement_mode: 'paid',
            operation_date: '2026-06-05',
            description: 'Vente de 5 plateaux d\'œufs',
            author_name: 'Bacary Admin'
        },
        {
            id: '2',
            operation_type: 'expense',
            category_name: 'Achat aliment volaille',
            party_name: 'Boutique Aliment Thiès',
            total_amount: 40000,
            total_paid: 40000,
            remaining_amount: 0,
            computed_payment_status: 'paid',
            settlement_mode: 'paid',
            operation_date: '2026-06-04',
            description: 'Achat 2 sacs aliment démarrage',
            author_name: 'Bacary Admin'
        },
        {
            id: '3',
            operation_type: 'income',
            category_name: 'Vente cailleteaux',
            party_name: 'Moussa Diop',
            total_amount: 30000,
            total_paid: 0,
            remaining_amount: 30000,
            computed_payment_status: 'unpaid',
            settlement_mode: 'credit',
            operation_date: '2026-06-03',
            description: 'Vente de 30 cailleteaux à crédit',
            author_name: 'Amadou Agent'
        },
        {
            id: '4',
            operation_type: 'income',
            category_name: 'Vente cailles reproductrices',
            party_name: 'Nafi Ndiaye',
            total_amount: 50000,
            total_paid: 20000,
            remaining_amount: 30000,
            computed_payment_status: 'partial',
            settlement_mode: 'partial',
            operation_date: '2026-06-02',
            description: 'Vente couple reproducteurs (acompte)',
            author_name: 'Fatou Agent'
        },
        {
            id: '5',
            operation_type: 'expense',
            category_name: 'Transport',
            party_name: 'Transporteur Thiès',
            total_amount: 5000,
            total_paid: 5000,
            remaining_amount: 0,
            computed_payment_status: 'paid',
            settlement_mode: 'paid',
            operation_date: '2026-06-01',
            description: 'Livraison œufs Thiès',
            author_name: 'Amadou Agent'
        }
    ]

    try {
        // Tentative de récupération des soldes depuis la vue account_balances
        const { data: bData } = await supabase
            .from('account_balances')
            .select('*')

        if (bData && bData.length > 0) {
            const waveAcc = bData.find(b => b.account_type === 'wave')
            const cashAcc = bData.find(b => b.account_type === 'cash')
            if (waveAcc) waveBalance = Number(waveAcc.balance)
            if (cashAcc) cashBalance = Number(cashAcc.balance)
        }

        // Tentative de récupération des dernières opérations
        const { data: oData } = await supabase
            .from('operation_payment_summary')
            .select('*')
            .order('operation_date', { ascending: false })
            .limit(5)

        if (oData && oData.length > 0) {
            // Mapping vers notre structure
            latestOperations = oData.map(o => ({
                id: o.operation_id,
                operation_type: o.operation_type,
                category_name: o.category_name,
                party_name: o.party_name,
                total_amount: Number(o.total_amount),
                total_paid: Number(o.total_paid),
                remaining_amount: Number(o.remaining_amount),
                computed_payment_status: o.computed_payment_status,
                settlement_mode: o.settlement_mode,
                operation_date: o.operation_date,
                description: o.description,
                author_name: o.created_by // Idéalement joint avec profiles, mais fallback ok
            }))
        }

        // Calcul du résultat du mois (income payé - expense payé de ce mois-ci)
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        const yyyymmdd = startOfMonth.toISOString().split('T')[0]

        const { data: currentMonthOps } = await supabase
            .from('operation_payment_summary')
            .select('*')
            .gte('operation_date', yyyymmdd)

        if (currentMonthOps) {
            monthlyIncome = currentMonthOps
                .filter(o => o.operation_type === 'income')
                .reduce((acc, o) => acc + Number(o.total_paid), 0)
            
            monthlyExpense = currentMonthOps
                .filter(o => o.operation_type === 'expense')
                .reduce((acc, o) => acc + Number(o.total_paid), 0)

            clientDebt = currentMonthOps
                .filter(o => o.operation_type === 'income')
                .reduce((acc, o) => acc + Number(o.remaining_amount), 0)

            supplierDebt = currentMonthOps
                .filter(o => o.operation_type === 'expense')
                .reduce((acc, o) => acc + Number(o.remaining_amount), 0)
        }
    } catch (e) {
        console.warn("La base de données n'est pas encore initialisée ou accessible. Utilisation des données de démonstration.", e)
    }

    const totalBalance = waveBalance + cashBalance
    const monthResult = monthlyIncome - monthlyExpense
    const netCreditBalance = clientDebt - supplierDebt

    return (
        <main className="min-h-screen bg-slate-950 text-white pb-24 font-sans">
            {/* Barre supérieure */}
            <header className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-4 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-emerald-500">SENCAILLE Finance</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">Bienvenue, {profile.full_name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                            {profile.role === 'admin' ? 'Admin' : 'Agent'}
                        </span>
                    </div>
                </div>
                <form action={handleSignOut}>
                    <button
                        type="submit"
                        className="rounded-xl border border-slate-800 hover:border-red-900 bg-slate-900 hover:bg-red-950/20 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-red-400 transition-all"
                    >
                        Déconnexion
                    </button>
                </form>
            </header>

            <div className="max-w-md mx-auto px-4 py-6 space-y-6">
                {/* Section Comptes (Trésorerie disponible) */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Trésorerie disponible</h2>
                    
                    {/* Carte principale Solde Total */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-900/30 p-6 shadow-lg">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <p className="text-xs font-medium text-emerald-400/80">Solde total disponible</p>
                        <p className="text-3xl font-extrabold mt-1 tracking-tight">{totalBalance.toLocaleString('fr-FR')} <span className="text-lg font-normal text-slate-400">FCFA</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Solde WAVE */}
                        <div className="rounded-xl bg-slate-900 border border-slate-850 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-slate-400">WAVE SENCAILLE</span>
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            </div>
                            <p className="text-lg font-bold tracking-tight">{waveBalance.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-400">FCFA</span></p>
                        </div>

                        {/* Solde Caisse */}
                        <div className="rounded-xl bg-slate-900 border border-slate-850 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-slate-400">Caisse Espèces</span>
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            </div>
                            <p className="text-lg font-bold tracking-tight">{cashBalance.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-400">FCFA</span></p>
                        </div>
                    </div>
                </section>

                {/* Section Ce mois-ci (Activité de trésorerie) */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Activité de trésorerie (ce mois)</h2>
                    <div className="rounded-2xl bg-slate-900 border border-slate-850 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">✓</div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400">Recettes encaissées</p>
                                    <p className="text-sm font-bold text-slate-200">{monthlyIncome.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">✗</div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400">Dépenses payées</p>
                                    <p className="text-sm font-bold text-slate-200">{monthlyExpense.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Résultat de trésorerie</span>
                            <span className={`text-sm font-bold ${monthResult >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {monthResult >= 0 ? '+' : ''}{monthResult.toLocaleString('fr-FR')} FCFA
                            </span>
                        </div>
                    </div>
                </section>

                {/* Section Crédits & Dettes */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Crédits & Dettes (ce mois)</h2>
                    <div className="rounded-2xl bg-slate-900 border border-slate-850 p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Clients débiteurs</p>
                                <p className="text-base font-bold text-amber-400 mt-1">{clientDebt.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Fournisseurs à payer</p>
                                <p className="text-base font-bold text-red-400 mt-1">{supplierDebt.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-400">Balance nette des crédits</span>
                            <span className={`font-bold ${netCreditBalance >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {netCreditBalance >= 0 ? '+' : ''}{netCreditBalance.toLocaleString('fr-FR')} FCFA
                            </span>
                        </div>
                    </div>
                </section>

                {/* Section Dernières opérations */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Dernières opérations</h2>
                        <span className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 cursor-pointer">Voir tout</span>
                    </div>

                    <div className="space-y-2.5">
                        {latestOperations.map((op) => {
                            const isIncome = op.operation_type === 'income'
                            const dateFormatee = new Date(op.operation_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                            })

                            // Couleurs des statuts
                            let statusBadge = null
                            if (op.computed_payment_status === 'paid') {
                                statusBadge = <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Payé</span>
                            } else if (op.computed_payment_status === 'partial') {
                                statusBadge = <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Partiel</span>
                            } else {
                                statusBadge = <span className="text-[10px] font-medium bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">À crédit</span>
                            }

                            return (
                                <div key={op.id} className="rounded-xl bg-slate-900 border border-slate-850 p-4 flex items-center justify-between hover:bg-slate-850/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {isIncome ? '+' : '-'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-200">{op.category_name}</p>
                                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                                <span>{dateFormatee}</span>
                                                <span>•</span>
                                                <span>{op.party_name || op.author_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className={`text-xs font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {isIncome ? '+' : '-'}{op.total_amount.toLocaleString('fr-FR')} FCFA
                                        </p>
                                        <div>{statusBadge}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            {/* Barre de navigation basse (Mobile Navigation) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-slate-850 px-6 py-2 flex justify-between items-center max-w-md mx-auto rounded-t-2xl shadow-xl">
                <button className="flex flex-col items-center gap-1 text-emerald-400">
                    <span className="text-lg">🏠</span>
                    <span className="text-[10px] font-medium">Accueil</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
                    <span className="text-lg">➕</span>
                    <span className="text-[10px] font-medium">Saisir</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
                    <span className="text-lg">📜</span>
                    <span className="text-[10px] font-medium">Historique</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
                    <span className="text-lg">💳</span>
                    <span className="text-[10px] font-medium">Crédits</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200">
                    <span className="text-lg">📊</span>
                    <span className="text-[10px] font-medium">Rapports</span>
                </button>
            </nav>
        </main>
    )
}
