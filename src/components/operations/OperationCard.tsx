import type { OperationWithDetails } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OperationCardProps {
  operation: OperationWithDetails;
  onClick: () => void;
}

export default function OperationCard({ operation, onClick }: OperationCardProps) {
  const isIncome = operation.operation_type === "income";
  const amountColor = isIncome ? "text-emerald-400" : "text-red-400";
  const bgBadgeColor = isIncome ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300";

  const sumPayments = operation.payments?.filter(p => p.status === 'active').reduce((sum, p) => sum + p.amount, 0) || 0;
  const restant = operation.total_amount - operation.initial_paid_amount - sumPayments;
  
  const statusLabels: Record<string, string> = {
    paid: "Payé",
    credit: "À crédit",
    partial: "Partiel"
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-gray-700 transition-colors active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${bgBadgeColor}`}>
            {isIncome ? "Recette" : "Dépense"}
          </span>
          <h3 className="font-bold text-gray-100 line-clamp-1">
            {operation.categories?.name || "Catégorie inconnue"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(operation.operation_date), "dd MMM yyyy", { locale: fr })}
            {operation.parties?.name && ` • ${operation.parties.name}`}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${amountColor}`}>
            {isIncome ? "+" : "-"}{operation.total_amount.toLocaleString("fr-FR")} F
          </p>
          <span className="text-xs font-medium text-gray-500 mt-1 inline-block">
            {statusLabels[operation.settlement_mode] || operation.settlement_mode}
          </span>
        </div>
      </div>

      {(restant > 0 || operation.description) && (
        <div className="mt-3 pt-3 border-t border-gray-800/50 flex flex-wrap gap-y-2 justify-between items-center text-xs">
          {operation.description ? (
            <p className="text-gray-500 line-clamp-1 max-w-[60%] italic">"{operation.description}"</p>
          ) : (
            <div />
          )}
          
          {restant > 0 && (
            <span className="text-amber-400 font-medium ml-auto">
              Reste: {restant.toLocaleString("fr-FR")} F
            </span>
          )}
        </div>
      )}
    </div>
  );
}
