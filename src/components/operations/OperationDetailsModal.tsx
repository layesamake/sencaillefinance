import { useState, useTransition } from "react";
import type { OperationWithDetails, Account } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PaymentModal from "./PaymentModal";
import { deletePaymentAction, deleteOperationAction } from "@/app/(connected)/operations/actions";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X, Share2, Loader2 } from "lucide-react";
import ReceiptGenerator from "./ReceiptGenerator";
import * as htmlToImage from "html-to-image";
import { useRef } from "react";

interface OperationDetailsModalProps {
  operation: OperationWithDetails;
  accounts: Account[];
  currentUserId?: string;
  onClose: () => void;
}

export default function OperationDetailsModal({ operation, accounts, currentUserId, onClose }: OperationDetailsModalProps) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isIncome = operation.operation_type === "income";
  const amountColor = isIncome ? "text-success" : "text-danger";
  
  const activePayments = operation.payments?.filter(p => p.status === 'active') || [];
  const sumPayments = activePayments.reduce((sum, p) => sum + p.amount, 0);
  const restant = operation.total_amount - operation.initial_paid_amount - sumPayments;
  
  const statusLabels: Record<string, string> = {
    paid: "Payé totalement",
    credit: "À crédit",
    partial: "Paiement partiel"
  };

  const handleShareReceipt = async () => {
    if (!receiptRef.current || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      const blob = await htmlToImage.toBlob(receiptRef.current, { 
        pixelRatio: 2, 
        backgroundColor: '#ffffff'
      });
      
      if (!blob) throw new Error("Failed to generate receipt blob");
      
      const file = new File([blob], `Recu_Sencaille_${format(new Date(operation.operation_date), "ddMMyyyy")}.png`, { type: "image/png" });
      
      // Try native share (WhatsApp, etc)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Reçu de paiement Sencaille',
          text: `Voici le reçu concernant l'opération du ${format(new Date(operation.operation_date), "dd/MM/yyyy")}.`,
          files: [file]
        });
      } else {
        // Fallback download for desktop
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      console.error("Error generating receipt:", error);
      alert("Une erreur est survenue lors de la génération du reçu : " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-primary-text">Détails de l'opération</h2>
          <div className="flex items-center gap-1">
            <button
              disabled={isPending}
              onClick={() => {
                onClose();
                router.push(`/operations/${operation.id}/edit`);
              }}
              className="p-2 rounded-full hover:bg-accent/10 text-muted hover:text-accent transition-colors"
              title="Modifier"
            >
              <Pencil size={20} />
            </button>
            <button
              disabled={isPending}
              onClick={() => {
                if (confirm("Voulez-vous vraiment supprimer cette opération et tous ses paiements associés ?")) {
                  startTransition(async () => {
                    await deleteOperationAction(operation.id);
                    onClose();
                  });
                }
              }}
              className="p-2 rounded-full hover:bg-danger/10 text-muted hover:text-danger transition-colors"
              title="Supprimer"
            >
              <Trash2 size={20} />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-hover text-muted hover:text-primary-text transition-colors"
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center">
            <span className="text-sm text-muted font-medium uppercase tracking-wider">
              {isIncome ? "Recette" : "Dépense"}
            </span>
            <p className={`text-4xl font-black mt-2 ${amountColor}`}>
              {isIncome ? "+" : "-"}{operation.total_amount.toLocaleString("fr-FR")} F
            </p>
            <p className="text-primary-text font-medium text-lg mt-1">
              {operation.categories?.name}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
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
                <DetailRow label="Reste à payer" value={`${restant.toLocaleString("fr-FR")} F`} valueColor="text-warning" />
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-3 w-full py-2.5 bg-warning/10 text-warning hover:bg-warning/20 rounded-xl text-sm font-semibold transition-colors"
                >
                  Saisir un paiement
                </button>
              </div>
            )}

            {activePayments.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="text-sm font-bold text-primary-text">Historique des paiements</h3>
                {activePayments.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-surface-hover/50 p-3 rounded-xl border border-border/50 group">
                    <div>
                      <p className="text-sm font-semibold text-primary-text">{p.amount.toLocaleString("fr-FR")} F</p>
                      <p className="text-xs text-muted mt-0.5">
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
                      className="p-2 text-muted hover:text-danger bg-surface/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 sm:block hidden"
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
                      className="p-2 text-muted hover:text-danger bg-surface/50 rounded-xl transition-all disabled:opacity-50 block sm:hidden"
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
                <span className="block text-sm text-muted mb-1">Description</span>
                <p className="text-sm text-primary-text bg-surface-hover/50 p-3 rounded-xl">
                  {operation.description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-border text-xs text-muted">
            <p>Saisie par : <span className="text-muted">{operation.profiles?.full_name || "Inconnu"}</span></p>
            <p>Créée le : {format(new Date(operation.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
            {operation.updated_at !== operation.created_at && (
              <p>Modifiée le : {format(new Date(operation.updated_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={handleShareReceipt}
              disabled={isGenerating}
              className="w-full py-3 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 border border-emerald-600/20 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Partager le reçu (WhatsApp)
                </>
              )}
            </button>
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

      {/* Hidden Receipt component for generation */}
      <ReceiptGenerator operation={operation} receiptRef={receiptRef} />
    </div>
  );
}

function DetailRow({ label, value, valueColor = "text-primary-text" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted">{label}</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  );
}
