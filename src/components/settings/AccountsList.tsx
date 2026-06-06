"use client";

import { useState } from "react";
import type { Account } from "@/types/database";
import AccountModal from "./AccountModal";
import { toggleAccountStatusAction } from "@/app/(connected)/settings/accounts/actions";

export default function AccountsList({ accounts }: { accounts: Account[] }) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setIsCreating(true)}
        className="w-full py-4 bg-surface-hover hover:bg-gray-700 border border-border border-dashed rounded-2xl text-primary-text font-bold transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Ajouter un compte
      </button>

      <div className="space-y-3">
        {accounts.map(acc => (
          <div key={acc.id} className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${acc.status === 'active' ? 'bg-surface border-border' : 'bg-surface/50 border-border/50 opacity-60'}`}>
            <div>
              <h3 className="font-bold text-primary-text flex items-center gap-2">
                {acc.name}
                {acc.status !== 'active' && <span className="text-[10px] uppercase bg-red-900/50 text-danger px-2 py-0.5 rounded-full">Inactif</span>}
              </h3>
              <p className="text-xs text-muted mt-1">Type: <span className="capitalize">{acc.account_type}</span> • Solde initial: {acc.opening_balance.toLocaleString("fr-FR")} F</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => toggleAccountStatusAction(acc.id, acc.status)}
                className="p-2 bg-surface-hover text-muted hover:text-primary-text rounded-xl"
                title={acc.status === 'active' ? 'Désactiver' : 'Activer'}
              >
                {acc.status === 'active' ? '⏸' : '▶️'}
              </button>
              <button 
                onClick={() => setEditingAccount(acc)}
                className="p-2 bg-blue-900/20 text-accent hover:bg-blue-900/40 rounded-xl"
              >
                ✏️
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editingAccount) && (
        <AccountModal 
          account={editingAccount || undefined} 
          onClose={() => {
            setIsCreating(false);
            setEditingAccount(null);
          }} 
        />
      )}
    </div>
  );
}
