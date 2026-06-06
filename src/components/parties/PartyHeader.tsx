"use client";

import { useState } from "react";
import type { Party } from "@/types/database";
import EditPartyModal from "./EditPartyModal";

export default function PartyHeader({ party, totalOwed }: { party: Party; totalOwed: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const isCustomer = party.party_type === "customer";
  const typeLabel = isCustomer ? "Client" : party.party_type === "supplier" ? "Fournisseur" : "Client / Fournisseur";

  return (
    <>
      <div className="bg-surface border border-border rounded-3xl p-6 relative overflow-hidden">
        {/* Actions */}
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 text-muted hover:text-primary-text bg-surface-hover rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-primary-text">{party.name}</h1>
          <p className="text-sm text-muted">{party.phone || "Aucun numéro"}</p>
          <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-surface-hover text-muted">
            {typeLabel}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Reste à payer total</p>
          <p className={`text-2xl font-black ${totalOwed > 0 ? "text-warning" : "text-success"}`}>
            {totalOwed > 0 ? `${totalOwed.toLocaleString("fr-FR")} F` : "Réglé"}
          </p>
        </div>
      </div>

      {isEditing && (
        <EditPartyModal party={party} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
