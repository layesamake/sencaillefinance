"use client";

import { useState, useTransition } from "react";
import type { Account, AccountType } from "@/types/database";
import { createAccountAction, updateAccountAction } from "@/app/(connected)/settings/accounts/actions";

interface Props {
  account?: Account;
  onClose: () => void;
}

export default function AccountModal({ account, onClose }: Props) {
  const isEditing = !!account;
  const [name, setName] = useState(account?.name || "");
  const [accountType, setAccountType] = useState<AccountType>(account?.account_type || "bank");
  const [openingBalance, setOpeningBalance] = useState(account?.opening_balance.toString() || "0");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("account_type", accountType);
      formData.set("opening_balance", openingBalance);

      if (isEditing) {
        formData.set("id", account.id);
        const res = await updateAccountAction(formData);
        if (res?.error) setError(res.error);
        else onClose();
      } else {
        const res = await createAccountAction(formData);
        if (res?.error) setError(res.error);
        else onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-primary-text">
            {isEditing ? "Modifier le compte" : "Nouveau compte"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-primary-text">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-950/50 text-danger text-sm rounded-xl">{error}</div>}
          
          <div>
            <label className="block text-sm text-muted mb-1">Nom du compte</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Wave Principal" className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Type de compte</label>
            <select value={accountType} onChange={e => setAccountType(e.target.value as AccountType)} className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none">
              <option value="wave">Wave</option>
              <option value="cash">Espèces (Caisse)</option>
              <option value="bank">Banque</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Solde initial (F CFA)</label>
            <input required type="number" step="1" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none" />
            <p className="text-xs text-muted mt-1">L'argent disponible sur ce compte au moment de sa création.</p>
          </div>

          <button type="submit" disabled={isPending} className="w-full py-3 bg-accent hover:bg-accent-hover rounded-xl text-primary-text font-bold transition-all disabled:opacity-50 mt-2">
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
