import Link from "next/link";
import type { Party } from "@/types/database";

export default function PartyCard({ party, userRole, onEdit }: { party: Party, userRole?: string, onEdit?: () => void }) {
  const isCustomer = party.party_type === "customer";
  const typeLabel = isCustomer ? "Client" : party.party_type === "supplier" ? "Fournisseur" : "Client / Fournisseur";
  const typeColor = isCustomer ? "bg-blue-500/20 text-blue-300" : party.party_type === "supplier" ? "bg-purple-500/20 text-purple-300" : "bg-gray-500/20 text-gray-300";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:bg-gray-800/80 transition-all group flex justify-between items-center">
      <Link href={`/parties/${party.id}`} className="flex-1 cursor-pointer">
        <div>
          <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
            {party.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{party.phone || "Aucun numéro"}</p>
        </div>
      </Link>
      
      <div className="flex flex-col items-end gap-2">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
          {typeLabel}
        </div>
        
        {userRole === "admin" && onEdit && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="text-gray-500 hover:text-blue-400 p-1 transition-colors"
            title="Modifier ce tiers"
          >
            ✏️
          </button>
        )}
      </div>
    </div>
  );
}
