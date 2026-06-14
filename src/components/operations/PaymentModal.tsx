"use client";

import { useState, useTransition } from "react";
import type { Account } from "@/types/database";
import { submitPaymentAction } from "@/app/(connected)/operations/actions";
import confetti from "canvas-confetti";

interface PaymentModalProps {
  operationId: string;
  restant: number;
  accounts: Account[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ operationId, restant, accounts, onClose, onSuccess }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("operation_id", operationId);
      formData.set("account_id", accountId);
      formData.set("amount", amount);
      formData.set("payment_date", paymentDate);
      if (description) formData.set("description", description);

      const result = await submitPaymentAction(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        if (parseFloat(amount) === restant) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#10b981', '#f59e0b']
          });
        }
        onSuccess();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-primary-text">Saisir un paiement</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-hover text-muted hover:text-primary-text transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-950/50 border border-red-900/50 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Reste à payer</label>
            <p className="text-lg font-bold text-warning">{restant.toLocaleString("fr-FR")} F</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Montant (FCFA)</label>
            <input
              type="number"
              min="1"
              max={restant}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm font-semibold text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Compte utilisé</label>
            <select
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent outline-none"
            >
              <option value="">Sélectionner un compte...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Date</label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Notes <span className="text-muted font-normal">(Facultatif)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-accent hover:bg-accent-hover py-3 mt-4 text-sm font-bold text-primary-text shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
