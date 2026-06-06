"use client";

import { useState, useTransition } from "react";
import type { Party } from "@/types/database";
import { updatePartyAction } from "@/app/(connected)/parties/actions";

export default function EditPartyModal({ party, onClose }: { party: Party; onClose: () => void }) {
  const [name, setName] = useState(party.name);
  const [phone, setPhone] = useState(party.phone || "");
  const [partyType, setPartyType] = useState(party.party_type);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", party.id);
      formData.set("name", name);
      formData.set("phone", phone);
      formData.set("party_type", partyType);

      const result = await updatePartyAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-primary-text">Modifier le tiers</h2>
          <button onClick={onClose} className="text-muted hover:text-primary-text">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-950/50 border border-red-900/50 text-danger text-sm rounded-xl">{error}</div>}
          
          <div>
            <label className="block text-sm text-muted mb-1">Nom complet</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-accent" />
          </div>
          
          <div>
            <label className="block text-sm text-muted mb-1">Téléphone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-accent" />
          </div>
          
          <div>
            <label className="block text-sm text-muted mb-1">Type</label>
            <select value={partyType} onChange={e => setPartyType(e.target.value as any)} className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-accent">
              <option value="customer">Client</option>
              <option value="supplier">Fournisseur</option>
              <option value="both">Client et Fournisseur</option>
            </select>
          </div>

          <button type="submit" disabled={isPending} className="w-full py-3 bg-accent hover:bg-accent-hover rounded-xl text-primary-text font-bold transition-all disabled:opacity-50 mt-2">
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
