import type { OperationWithDetails } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OperationDetailsModalProps {
  operation: OperationWithDetails;
  onClose: () => void;
}

export default function OperationDetailsModal({ operation, onClose }: OperationDetailsModalProps) {
  const isIncome = operation.operation_type === "income";
  const amountColor = isIncome ? "text-emerald-400" : "text-red-400";
  
  const restant = operation.total_amount - operation.initial_paid_amount;
  
  const statusLabels: Record<string, string> = {
    paid: "Payé totalement",
    credit: "À crédit",
    partial: "Paiement partiel"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-gray-100">Détails de l'opération</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center">
            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
              {isIncome ? "Recette" : "Dépense"}
            </span>
            <p className={`text-4xl font-black mt-2 ${amountColor}`}>
              {isIncome ? "+" : "-"}{operation.total_amount.toLocaleString("fr-FR")} F
            </p>
            <p className="text-gray-300 font-medium text-lg mt-1">
              {operation.categories?.name}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800">
            <DetailRow label="Date" value={format(new Date(operation.operation_date), "dd MMMM yyyy", { locale: fr })} />
            <DetailRow label="Règlement" value={statusLabels[operation.settlement_mode]} />
            
            {operation.settlement_mode !== "credit" && (
              <>
                <DetailRow label="Montant payé" value={`${operation.initial_paid_amount.toLocaleString("fr-FR")} F`} />
                <DetailRow label="Compte utilisé" value={operation.accounts?.name || "Non spécifié"} />
              </>
            )}

            {restant > 0 && (
              <DetailRow label="Reste à payer" value={`${restant.toLocaleString("fr-FR")} F`} valueColor="text-amber-400" />
            )}

            {(operation.parties || operation.settlement_mode !== "paid") && (
              <DetailRow label={isIncome ? "Client" : "Fournisseur"} value={operation.parties?.name || "Non spécifié"} />
            )}

            {operation.description && (
              <div className="pt-2">
                <span className="block text-sm text-gray-500 mb-1">Description</span>
                <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-xl">
                  {operation.description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-800 text-xs text-gray-500">
            <p>Saisie par : <span className="text-gray-400">{operation.profiles?.full_name || "Inconnu"}</span></p>
            <p>Créée le : {format(new Date(operation.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
            {operation.updated_at !== operation.created_at && (
              <p>Modifiée le : {format(new Date(operation.updated_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, valueColor = "text-gray-200" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  );
}
