import { getOperations, type OperationsFilters as QueryFilters } from "@/lib/queries/operations";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveAccounts } from "@/lib/queries/accounts";
import OperationsList from "@/components/operations/OperationsList";
import OperationsFilters from "@/components/operations/OperationsFilters";
import ExportPdfButton from "@/components/operations/ExportPdfButton";
import { createClient } from "@/lib/supabase/server";

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await Promise.resolve(searchParams);

  // Convertir les searchParams en filtres pour la requête
  const filters: QueryFilters = {
    period: (params.period as any) || "this_month",
    type: (params.type as any) || "all",
    categoryId: params.categoryId || "all",
    paymentStatus: (params.paymentStatus as any) || "all",
  };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  const [operations, categories, accounts] = await Promise.all([
    getOperations(filters),
    getActiveCategories(),
    getActiveAccounts()
  ]);

  // Calcul des résumés
  const totalAmount = operations.reduce((sum, op) => sum + op.total_amount, 0);
  const totalPaid = operations.reduce((sum, op) => {
    const sumPayments = op.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
    return sum + op.initial_paid_amount + sumPayments;
  }, 0);
  const totalCredit = totalAmount - totalPaid;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Historique</h1>
          <p className="text-sm text-muted mt-1">
            {operations.length} opération(s) trouvée(s)
          </p>
        </div>
        <ExportPdfButton operations={operations} />
      </div>

      <OperationsFilters categories={categories} />

      {/* Résumé des totaux filtrés */}
      {operations.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-surface border border-border p-3 rounded-2xl text-center">
            <span className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">Total Payé</span>
            <span className="text-lg font-bold text-accent">{totalPaid.toLocaleString("fr-FR")} F</span>
          </div>
          <div className="bg-surface border border-border p-3 rounded-2xl text-center">
            <span className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">Reste à payer</span>
            <span className="text-lg font-bold text-warning">{totalCredit.toLocaleString("fr-FR")} F</span>
          </div>
        </div>
      )}

      <OperationsList operations={operations} accounts={accounts} currentUserId={currentUserId} />
    </div>
  );
}
