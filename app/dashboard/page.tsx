import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from './components/BottomNav'

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

    let categories = []
    let accounts = []
    let parties = []

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

        // Calcul du résultat du mois
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

        // Récupération des données pour le formulaire de saisie
        const [{ data: cats }, { data: accs }, { data: pts }] = await Promise.all([
            supabase.from('categories').select('id, name, type'), // type: income/expense si ça existe, sinon on triera manuellement
            supabase.from('accounts').select('id, name'),
            supabase.from('parties').select('id, name')
        ])

        if (cats) categories = cats
        if (accs) accounts = accs
        if (pts) parties = pts

    } catch (e) {
        console.warn("La base de données n'est pas encore totalement accessible. Utilisation des données de démonstration.", e)
    }

    const totalBalance = waveBalance + cashBalance
    const monthResult = monthlyIncome - monthlyExpense
    const netCreditBalance = clientDebt - supplierDebt

    return (
        <main className="min-h-[100dvh] bg-background text-slate-50 pb-24 font-sans">
            {/* Barre supérieure */}
            <header className="sticky top-0 z-40 px-6 py-5 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-slate-800/30">
                <div>
                    <h1 className="text-xl font-medium tracking-tight text-slate-50">Sencaille</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{profile.full_name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                </div>
            </header>

            <div className="max-w-lg mx-auto px-6 py-8 space-y-12">
                {/* Section Solde Principal */}
                <section className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Solde total disponible</p>
                        <p className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-50 font-mono">
                            {totalBalance.toLocaleString('fr-FR')} <span className="text-lg text-slate-500 font-sans font-normal">FCFA</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-800/30">
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-2">
                                WAVE <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            </p>
                            <p className="text-xl font-medium text-slate-200 font-mono">{waveBalance.toLocaleString('fr-FR')} <span className="text-xs text-slate-500 font-sans">FCFA</span></p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-2">
                                Caisse <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            </p>
                            <p className="text-xl font-medium text-slate-200 font-mono">{cashBalance.toLocaleString('fr-FR')} <span className="text-xs text-slate-500 font-sans">FCFA</span></p>
                        </div>
                    </div>
                </section>

                {/* Section Résumé du mois */}
                <section className="space-y-4">
                    <h2 className="text-xs font-medium tracking-wider text-slate-500 uppercase">Ce mois-ci</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-300">Entrées</span>
                            <span className="text-sm font-medium text-emerald-400 font-mono">+{monthlyIncome.toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-slate-800/30">
                            <span className="text-sm text-slate-300">Sorties</span>
                            <span className="text-sm font-medium text-rose-400 font-mono">-{monthlyExpense.toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-slate-800/30">
                            <span className="text-sm text-slate-300">Résultat net</span>
                            <span className={`text-sm font-medium font-mono ${monthResult >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {monthResult >= 0 ? '+' : ''}{monthResult.toLocaleString('fr-FR')}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Section Dernières opérations */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-medium tracking-wider text-slate-500 uppercase">Dernières opérations</h2>
                        <button className="p-3 -mr-3 text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors">Voir tout</button>
                    </div>

                    <div className="flex flex-col">
                        {latestOperations.map((op, index) => {
                            const isIncome = op.operation_type === 'income'
                            const dateFormatee = new Date(op.operation_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                            })

                            return (
                                <div key={op.id} className={`py-4 flex items-start justify-between ${index !== 0 ? 'border-t border-slate-800/30' : ''}`}>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium text-slate-200">{op.category_name}</p>
                                        <p className="text-xs text-slate-500">{dateFormatee} • {op.party_name || op.author_name}</p>
                                        {op.computed_payment_status !== 'paid' && (
                                            <p className={`text-[10px] font-medium mt-0.5 ${op.computed_payment_status === 'partial' ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {op.computed_payment_status === 'partial' ? 'Paiement partiel' : 'À crédit'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-medium font-mono ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                                            {isIncome ? '+' : '-'}{op.total_amount.toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            {/* Navigation basse interactive avec Tiroir de Saisie */}
            <BottomNav categories={categories} accounts={accounts} parties={parties} />
        </main>
    )
}
