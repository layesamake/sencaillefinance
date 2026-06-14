import React from "react";
import type { OperationWithDetails } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptGeneratorProps {
  operation: OperationWithDetails;
  receiptRef: React.RefObject<HTMLDivElement>;
}

export default function ReceiptGenerator({ operation, receiptRef }: ReceiptGeneratorProps) {
  const isIncome = operation.operation_type === "income";
  const typeLabel = isIncome ? "Reçu de Paiement" : "Preuve de Paiement";
  
  const sumPayments = operation.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
  const totalPaid = operation.initial_paid_amount + sumPayments;
  const credit = operation.total_amount - totalPaid;
  const isPaid = totalPaid >= operation.total_amount;

  return (
    <div className="absolute top-0 left-0 z-[-50] opacity-0 pointer-events-none">
      <div 
        ref={receiptRef} 
        className="w-[400px] bg-white text-gray-900 p-8 font-sans shadow-lg"
        style={{ borderRadius: '12px' }} // HTML2Canvas handles inline styles better sometimes
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">SENCAILLE</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Finance</p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {typeLabel}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {format(new Date(), "dd MMM yyyy, HH:mm", { locale: fr })}
            </p>
          </div>
        </div>

        {/* Operation Details */}
        <div className="space-y-5 mb-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Date de l'opération</p>
            <p className="text-base font-medium text-gray-800">
              {format(new Date(operation.operation_date), "dd MMMM yyyy", { locale: fr })}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Tiers</p>
              <p className="text-base font-semibold text-gray-800">{operation.parties?.name || "Non spécifié"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Catégorie</p>
              <p className="text-base font-medium text-gray-800">{operation.categories?.name || "Général"}</p>
            </div>
          </div>

          {operation.description && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Description</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {operation.description}
              </p>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-500">Montant Total</span>
            <span className="text-base font-bold text-gray-900">{operation.total_amount.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-500">Déjà Payé</span>
            <span className="text-base font-bold text-emerald-600">{totalPaid.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-800">Reste à payer</span>
            <span className={`text-lg font-black ${credit > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
              {credit.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-dashed border-gray-200">
          <p className="text-xs text-gray-400 font-medium">Document généré automatiquement.</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Merci pour votre confiance !</p>
        </div>
      </div>
    </div>
  );
}
