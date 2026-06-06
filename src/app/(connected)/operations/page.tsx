import { getOperations, type OperationsFilters as QueryFilters } from "@/lib/queries/operations";
import { getActiveCategories } from "@/lib/queries/categories";
import OperationsList from "@/components/operations/OperationsList";
import OperationsFilters from "@/components/operations/OperationsFilters";

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

  const [operations, categories] = await Promise.all([
    getOperations(filters),
    getActiveCategories()
  ]);

  // Calcul des résumés
  const totalAmount = operations.reduce((sum, op) => sum + op.total_amount, 0);
  const totalPaid = operations.reduce((sum, op) => sum + op.initial_paid_amount, 0);
  const totalCredit = operations.reduce((sum, op) => sum + (op.total_amount - op.initial_paid_amount), 0);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Historique</h1>
        <p className="text-sm text-gray-500 mt-1">
          {operations.length} opération(s) trouvée(s)
        </p>
      </div>

      <OperationsFilters categories={categories} />

      {/* Résumé des totaux filtrés */}
      {operations.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-gray-900 border border-gray-800 p-3 rounded-2xl text-center">
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Payé</span>
            <span className="text-lg font-bold text-blue-400">{totalPaid.toLocaleString("fr-FR")} F</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-3 rounded-2xl text-center">
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Reste à payer</span>
            <span className="text-lg font-bold text-amber-400">{totalCredit.toLocaleString("fr-FR")} F</span>
          </div>
        </div>
      )}

      <OperationsList operations={operations} />
    </div>
  );
}
