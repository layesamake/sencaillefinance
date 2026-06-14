import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, role, status')
        .eq('id', user.id)
        .single()

    if (!profile || profile.status !== 'active') {
        redirect('/login')
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>

            <p className="mt-2 text-slate-300">
                Bienvenue, {profile.full_name}
            </p>

            <p className="mt-1 text-sm text-slate-500">
                Rôle : {profile.role === 'admin' ? 'Administrateur' : 'Utilisateur simple'}
            </p>
        </main>
    )
}