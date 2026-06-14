import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '../dashboard/components/BottomNav'
import HistoryList from './components/HistoryList'

export default async function HistoryPage() {
    const supabase = await createClient()

    // 1. Vérification de la session utilisateur
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Récupération des données pour BottomNav (Tiroir de saisie)
    let categories = []
    let accounts = []
    let parties = []
    let operations = []

    try {
        const [{ data: cats }, { data: accs }, { data: pts }] = await Promise.all([
            supabase.from('categories').select('id, name, type'),
            supabase.from('accounts').select('id, name'),
            supabase.from('parties').select('id, name')
        ])
        if (cats) categories = cats
        if (accs) accounts = accs
        if (pts) parties = pts

        // 3. Récupération de TOUTES les opérations (ou max 100 pour l'instant)
        const { data: oData } = await supabase
            .from('operation_payment_summary')
            .select('*')
            .order('operation_date', { ascending: false })
            .limit(100)

        if (oData) {
            operations = oData.map(o => ({
                id: o.operation_id,
                operation_type: o.operation_type,
                category_name: o.category_name,
                party_name: o.party_name,
                total_amount: Number(o.total_amount),
                operation_date: o.operation_date,
                description: o.description,
                author_name: o.created_by
            }))
        }
    } catch (e) {
        console.error("Erreur de récupération de l'historique", e)
    }

    // Données de démonstration si vide (pour la beauté de l'UI en dev)
    if (operations.length === 0) {
        operations = [
            { id: '1', operation_type: 'income', category_name: 'Vente œufs de caille', total_amount: 20000, operation_date: '2026-06-05', author_name: 'Bacary Admin' },
            { id: '2', operation_type: 'expense', category_name: 'Achat aliment', total_amount: 40000, operation_date: '2026-06-04', author_name: 'Bacary Admin' }
        ]
    }

    return (
        <main className="min-h-[100dvh] bg-background text-slate-50 pb-24 font-sans">
            {/* Barre supérieure */}
            <header className="sticky top-0 z-40 px-6 py-5 bg-background/80 backdrop-blur-md border-b border-slate-800/30">
                <h1 className="text-xl font-medium tracking-tight text-slate-50 text-center">Historique</h1>
            </header>

            <div className="max-w-lg mx-auto px-6 py-8">
                <HistoryList operations={operations} />
            </div>

            {/* Navigation basse interactive avec Tiroir de Saisie */}
            <BottomNav categories={categories} accounts={accounts} parties={parties} />
        </main>
    )
}
