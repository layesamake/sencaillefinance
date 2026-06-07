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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Tableau de bord</h1>
          <p className="text-sm text-muted mt-1">
            Aperçu de votre situation financière
          </p>
        </div>
        <Link 
          href="/operations/new?tab=transfer"
          className="p-2 bg-surface border border-border rounded-xl text-accent hover:bg-surface-hover transition-colors"
          title="Faire un transfert"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </Link>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-blue-900 to-gray-900 border border-blue-800/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute -top-4 -right-4 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        <p className="text-sm font-medium text-blue-200/80 uppercase tracking-wider mb-2">
          Solde Total en Caisse
        </p>
        <p className="text-4xl font-black text-primary-text relative z-10">
          {stats.totalBalance.toLocaleString("fr-FR")} <span className="text-2xl text-accent">F</span>
        </p>
      </div>

      {/* Individual Accounts Balances */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {accounts.map(acc => {
          const balance = stats.accountBalances[acc.id] || 0;
          return (
            <div key={acc.id} className="min-w-[140px] flex-shrink-0 bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between">
              <p className="text-xs font-semibold text-muted uppercase truncate mb-2">{acc.name}</p>
              <p className="text-lg font-bold text-primary-text">{balance.toLocaleString("fr-FR")} <span className="text-sm text-accent">F</span></p>
            </div>
          );
        })}
      </div>

      {/* Debts and Receivables */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-3xl p-5">
          <div className="flex items-center space-x-2 text-success mb-2">
            <ArrowDownRight size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Créances</p>
          </div>
          <p className="text-xl font-bold text-primary-text">{stats.totalReceivables.toLocaleString("fr-FR")} F</p>
          <p className="text-xs text-muted mt-1">À recouvrer</p>
        </div>
        <div className="bg-surface border border-border rounded-3xl p-5">
          <div className="flex items-center space-x-2 text-danger mb-2">
            <ArrowUpRight size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Dettes</p>
          </div>
          <p className="text-xl font-bold text-primary-text">{stats.totalDebts.toLocaleString("fr-FR")} F</p>
          <p className="text-xs text-muted mt-1">À payer</p>
        </div>
      </div>

      {/* Overdue Widgets */}
      {(stats.overdueReceivablesList.length > 0 || stats.overdueDebtsList.length > 0) && (
        <div className="space-y-3">
          {stats.overdueReceivablesList.length > 0 && (
            <Link href="/credits" className="block bg-danger/10 border border-danger/30 rounded-2xl p-4 flex justify-between items-center hover:bg-danger/20 transition-colors">
              <div>
                <h3 className="text-danger font-bold flex items-center gap-2">
                  <span className="text-lg">🚨</span> À relancer
                </h3>
                <p className="text-sm text-danger/90 mt-1 font-medium">
                  {stats.overdueReceivablesList.length} créance(s) de plus de 15 jours
                </p>
              </div>
              <div className="bg-danger/20 p-2 rounded-full">
                <ArrowUpRight className="text-danger" size={20} />
              </div>
            </Link>
          )}

          {stats.overdueDebtsList.length > 0 && (
            <Link href="/credits" className="block bg-warning/10 border border-warning/30 rounded-2xl p-4 flex justify-between items-center hover:bg-warning/20 transition-colors">
              <div>
                <h3 className="text-warning font-bold flex items-center gap-2">
                  <span className="text-lg">⚠️</span> À payer urgemment
                </h3>
                <p className="text-sm text-warning/90 mt-1 font-medium">
                  {stats.overdueDebtsList.length} dette(s) de plus de 15 jours
                </p>
              </div>
              <div className="bg-warning/20 p-2 rounded-full">
                <ArrowUpRight className="text-warning" size={20} />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Monthly Performance */}
      <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Activity size={20} className="text-accent" />
          <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider">Performance du mois</h2>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Entrées</span>
              <span className="font-bold text-success">+{stats.thisMonthIncome.toLocaleString("fr-FR")} F</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
              <div className="bg-success h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Sorties</span>
              <span className="font-bold text-danger">-{stats.thisMonthExpense.toLocaleString("fr-FR")} F</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
              <div className="bg-danger h-full rounded-full" style={{ width: stats.thisMonthIncome > 0 ? `${Math.min((stats.thisMonthExpense / stats.thisMonthIncome) * 100, 100)}%` : '0%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Operations */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-text">Dernières opérations</h2>
          <Link href="/operations" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            Voir tout
          </Link>
        </div>
        
        {stats.recentOperations.length > 0 ? (
          <OperationsList operations={stats.recentOperations} accounts={accounts} />
        ) : (
          <div className="text-center py-10 bg-surface border border-border rounded-3xl">
            <p className="text-muted">Aucune opération récente.</p>
          </div>
        )}
      </div>

    </div>
  );
}
