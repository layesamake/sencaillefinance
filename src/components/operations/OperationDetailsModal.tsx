import { useState, useTransition } from "react";
import type { OperationWithDetails, Account } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PaymentModal from "./PaymentModal";
import { deletePaymentAction } from "@/app/(connected)/operations/actions";

interface OperationDetailsModalProps {
  operation: OperationWithDetails;
  accounts: Account[];
  onClose: () => void;
}

export default function OperationDetailsModal({ operation, accounts, onClose }: OperationDetailsModalProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isIncome = operation.operation_type === "income";
  const amountColor = isIncome ? "text-emerald-400" : "text-red-400";
  
  const activePayments = operation.payments?.filter(p => p.status === 'active') || [];
  const sumPayments = activePayments.reduce((sum, p) => sum + p.amount, 0);
  const restant = operation.total_amount - operation.initial_paid_amount - sumPayments;
  
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
              <div className="pt-2">
                <DetailRow label="Reste à payer" value={`${restant.toLocaleString("fr-FR")} F`} valueColor="text-amber-400" />
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-3 w-full py-2.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-xl text-sm font-semibold transition-colors"
                >
                  Saisir un paiement
                </button>
              </div>
            )}

            {activePayments.length > 0 && (
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <h3 className="text-sm font-bold text-gray-300">Historique des paiements</h3>
                {activePayments.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 group">
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{p.amount.toLocaleString("fr-FR")} F</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(p.payment_date), "dd MMM yyyy", { locale: fr })} • {p.accounts?.name || "Compte inconnu"}
                      </p>
                    </div>
                    <button 
                      disabled={isPending}
                      onClick={() => {
                        if(confirm("Voulez-vous vraiment annuler ce paiement ?")) {
                          startTransition(async () => {
                            await deletePaymentAction(p.id);
                            onClose();
                          });
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 bg-gray-900/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 sm:block hidden"
                      title="Supprimer ce paiement"
                    >
                      🗑️
                    </button>
                    <button 
                      disabled={isPending}
                      onClick={() => {
                        if(confirm("Voulez-vous vraiment annuler ce paiement ?")) {
                          startTransition(async () => {
                            await deletePaymentAction(p.id);
                            onClose();
                          });
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 bg-gray-900/50 rounded-xl transition-all disabled:opacity-50 block sm:hidden"
                      title="Supprimer ce paiement"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
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

      {showPaymentModal && (
        <PaymentModal
          operationId={operation.id}
          restant={restant}
          accounts={accounts}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            onClose(); // Ferme les détails pour voir la liste rafraîchie
          }}
        />
      )}
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
