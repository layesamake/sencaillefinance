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
        className="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 border-dashed rounded-2xl text-gray-300 font-bold transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Ajouter un compte
      </button>

      <div className="space-y-3">
        {accounts.map(acc => (
          <div key={acc.id} className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${acc.status === 'active' ? 'bg-gray-900 border-gray-800' : 'bg-gray-900/50 border-gray-800/50 opacity-60'}`}>
            <div>
              <h3 className="font-bold text-gray-100 flex items-center gap-2">
                {acc.name}
                {acc.status !== 'active' && <span className="text-[10px] uppercase bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full">Inactif</span>}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Type: <span className="capitalize">{acc.account_type}</span> • Solde initial: {acc.opening_balance.toLocaleString("fr-FR")} F</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => toggleAccountStatusAction(acc.id, acc.status)}
                className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-xl"
                title={acc.status === 'active' ? 'Désactiver' : 'Activer'}
              >
                {acc.status === 'active' ? '⏸' : '▶️'}
              </button>
              <button 
                onClick={() => setEditingAccount(acc)}
                className="p-2 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 rounded-xl"
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
