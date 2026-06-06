"use client";

import { useState } from "react";
import type { OperationWithDetails, Account } from "@/types/database";
import OperationsList from "@/components/operations/OperationsList";

interface CreditsViewProps {
  receivables: OperationWithDetails[];
  debts: OperationWithDetails[];
  accounts: Account[];
}

export default function CreditsView({ receivables, debts, accounts }: CreditsViewProps) {
  const [activeTab, setActiveTab] = useState<"receivables" | "debts">("receivables");

  const currentList = activeTab === "receivables" ? receivables : debts;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-gray-900 rounded-2xl p-1 border border-gray-800 relative z-10">
        <button
          onClick={() => setActiveTab("receivables")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            activeTab === "receivables"
              ? "bg-gray-800 text-emerald-400 shadow-md"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Créances ({receivables.length})
        </button>
        <button
          onClick={() => setActiveTab("debts")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            activeTab === "debts"
              ? "bg-gray-800 text-red-400 shadow-md"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Dettes ({debts.length})
        </button>
      </div>

      {/* List */}
      <div>
        {currentList.length > 0 ? (
          <OperationsList operations={currentList} accounts={accounts} />
        ) : (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-3xl">
            <p className="text-gray-500">
              {activeTab === "receivables" 
                ? "Aucune créance en attente ! Tout le monde a payé." 
                : "Aucune dette en attente ! Vous êtes à jour."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
