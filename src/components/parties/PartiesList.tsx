"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { Party } from "@/types/database";
import PartyCard from "./PartyCard";
import EditPartyModal from "./EditPartyModal";
import QuickPartyModal from "./QuickPartyModal";
import EmptyState from "@/components/ui/EmptyState";

export default function PartiesList({ parties, userRole }: { parties: Party[], userRole?: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "customer" | "supplier">("all");
  const [search, setSearch] = useState("");
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [isAdding, setIsAdding] = useState<"customer" | "supplier" | null>(null);

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
        
        <button 
          onClick={() => setIsAdding(filter === "supplier" ? "supplier" : "customer")}
          className="flex items-center justify-center space-x-2 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-3 rounded-xl transition-colors font-medium text-sm whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Nouveau</span>
        </button>
      </div>

      <div className="space-y-3">
        {filteredParties.length === 0 ? (
          <EmptyState
            title="Aucun contact trouvé"
            description="La liste est vide ou aucun résultat ne correspond à votre recherche."
            icon={
              <svg className="w-10 h-10 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
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
      
      {isAdding && (
        <QuickPartyModal 
          partyType={isAdding} 
          onClose={() => setIsAdding(null)} 
          onCreated={(party) => {
            setIsAdding(null);
            router.refresh();
          }} 
        />
      )}
    </div>
  );
}
