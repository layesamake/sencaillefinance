"use client";

import { useState } from "react";
import type { Party } from "@/types/database";
import PartyCard from "./PartyCard";
import EditPartyModal from "./EditPartyModal";

export default function PartiesList({ parties, userRole }: { parties: Party[], userRole?: string }) {
  const [filter, setFilter] = useState<"all" | "customer" | "supplier">("all");
  const [search, setSearch] = useState("");
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  const filteredParties = parties.filter(p => {
    if (filter !== "all" && p.party_type !== filter && p.party_type !== "both") return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Rechercher un nom..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl bg-surface border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-xl bg-surface border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none"
        >
          <option value="all">Tous les types</option>
          <option value="customer">Clients</option>
          <option value="supplier">Fournisseurs</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredParties.length === 0 ? (
          <div className="text-center py-10 bg-surface border border-border rounded-3xl">
            <p className="text-muted">Aucun résultat trouvé.</p>
          </div>
        ) : (
          filteredParties.map(party => (
            <PartyCard 
              key={party.id} 
              party={party} 
              userRole={userRole} 
              onEdit={() => setEditingParty(party)} 
            />
          ))
        )}
      </div>

      {editingParty && (
        <EditPartyModal party={editingParty} onClose={() => setEditingParty(null)} />
      )}
    </div>
  );
}
