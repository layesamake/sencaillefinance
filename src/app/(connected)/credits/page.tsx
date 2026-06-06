import { getOperations } from "@/lib/queries/operations";
import { getActiveAccounts } from "@/lib/queries/accounts";
import CreditsView from "@/components/credits/CreditsView";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default async function CreditsPage() {
  const [pendingOperations, accounts] = await Promise.all([
    getOperations({ paymentStatus: "pending" }),
    getActiveAccounts()
  ]);

  const receivables = pendingOperations.filter(op => op.operation_type === "income");
  const debts = pendingOperations.filter(op => op.operation_type === "expense");

  const totalReceivables = receivables.reduce((sum, op) => {
    const sumPayments = op.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
    const paid = op.initial_paid_amount + sumPayments;
    return sum + (op.total_amount - paid);
  }, 0);

  const totalDebts = debts.reduce((sum, op) => {
    const sumPayments = op.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
    const paid = op.initial_paid_amount + sumPayments;
    return sum + (op.total_amount - paid);
  }, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Suivi des Crédits</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez vos créances clients et dettes fournisseurs
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ArrowDownRight size={80} />
          </div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ArrowDownRight size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Créances</p>
          </div>
          <p className="text-2xl font-black text-gray-100">{totalReceivables.toLocaleString("fr-FR")} F</p>
          <p className="text-xs text-gray-500 mt-1">À recouvrer</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ArrowUpRight size={80} />
          </div>
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <ArrowUpRight size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Dettes</p>
          </div>
          <p className="text-2xl font-black text-gray-100">{totalDebts.toLocaleString("fr-FR")} F</p>
          <p className="text-xs text-gray-500 mt-1">À payer</p>
        </div>
      </div>

      <CreditsView receivables={receivables} debts={debts} accounts={accounts} />
    </div>
  );
}
