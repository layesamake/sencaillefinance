import { getDashboardStats } from "@/lib/queries/dashboard";
import { getActiveAccounts } from "@/lib/queries/accounts";
import OperationsList from "@/components/operations/OperationsList";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from "lucide-react";

export default async function DashboardPage() {
  const [stats, accounts] = await Promise.all([
    getDashboardStats(),
    getActiveAccounts()
  ]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">
          Aperçu de votre situation financière
        </p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-800/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute -top-4 -right-4 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        <p className="text-sm font-medium text-blue-200/80 uppercase tracking-wider mb-2">
          Solde Total en Caisse
        </p>
        <p className="text-4xl font-black text-white relative z-10">
          {stats.totalBalance.toLocaleString("fr-FR")} <span className="text-2xl text-blue-300">F</span>
        </p>
      </div>

      {/* Debts and Receivables */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ArrowDownRight size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Créances</p>
          </div>
          <p className="text-xl font-bold text-gray-100">{stats.totalReceivables.toLocaleString("fr-FR")} F</p>
          <p className="text-xs text-gray-500 mt-1">À recouvrer</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <ArrowUpRight size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Dettes</p>
          </div>
          <p className="text-xl font-bold text-gray-100">{stats.totalDebts.toLocaleString("fr-FR")} F</p>
          <p className="text-xs text-gray-500 mt-1">À payer</p>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Activity size={20} className="text-blue-400" />
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Performance du mois</h2>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Entrées</span>
              <span className="font-bold text-emerald-400">+{stats.thisMonthIncome.toLocaleString("fr-FR")} F</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Sorties</span>
              <span className="font-bold text-red-400">-{stats.thisMonthExpense.toLocaleString("fr-FR")} F</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: stats.thisMonthIncome > 0 ? `${Math.min((stats.thisMonthExpense / stats.thisMonthIncome) * 100, 100)}%` : '0%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Operations */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-100">Dernières opérations</h2>
          <Link href="/operations" className="text-sm font-medium text-blue-400 hover:text-blue-300">
            Voir tout
          </Link>
        </div>
        
        {stats.recentOperations.length > 0 ? (
          <OperationsList operations={stats.recentOperations} accounts={accounts} />
        ) : (
          <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-3xl">
            <p className="text-gray-500">Aucune opération récente.</p>
          </div>
        )}
      </div>

    </div>
  );
}
