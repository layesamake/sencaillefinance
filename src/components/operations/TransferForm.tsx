"use client";

import { useState, useTransition } from "react";
import type { Account } from "@/types/database";
import { submitTransferAction } from "@/app/(connected)/operations/actions";

interface TransferFormProps {
  accounts: Account[];
}

export default function TransferForm({ accounts }: TransferFormProps) {
  const [sourceAccountId, setSourceAccountId] = useState<string>("");
  const [destinationAccountId, setDestinationAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("source_account_id", sourceAccountId);
      formData.set("destination_account_id", destinationAccountId);
      formData.set("amount", amount);
      formData.set("transfer_date", transferDate);
      if (description) formData.set("description", description);

      const result = await submitTransferAction(formData);

      if (result.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setAmount("");
        setDescription("");
        alert("Transfert effectué avec succès !");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-950/50 border border-red-900/50 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-2xl p-5 border border-border space-y-5">
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">De (Compte source)</label>
            <select
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent appearance-none"
            >
              <option value="">Choisir un compte...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Vers (Compte destination)</label>
            <select
              value={destinationAccountId}
              onChange={(e) => setDestinationAccountId(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent appearance-none"
            >
              <option value="">Choisir un compte...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Montant (FCFA)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 50000"
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-lg font-semibold text-primary-text placeholder:text-gray-600 placeholder:font-normal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-border space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Date</label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent appearance-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">
              Description <span className="text-muted font-normal">(Facultatif)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Alimentation caisse..."
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !sourceAccountId || !destinationAccountId || !amount}
          className="w-full rounded-xl bg-accent hover:bg-accent-hover py-4 text-sm font-bold text-primary-text shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
        >
          {isPending ? "Transfert en cours..." : "Effectuer le transfert"}
        </button>
      </form>
    </div>
  );
}
