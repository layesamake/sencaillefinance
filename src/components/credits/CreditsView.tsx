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
      <div className="flex bg-surface rounded-2xl p-1 border border-border relative z-10">
        <button
          onClick={() => setActiveTab("receivables")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            activeTab === "receivables"
              ? "bg-surface-hover text-success shadow-md"
              : "text-muted hover:text-primary-text"
          }`}
        >
          Créances ({receivables.length})
        </button>
        <button
          onClick={() => setActiveTab("debts")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            activeTab === "debts"
              ? "bg-surface-hover text-danger shadow-md"
              : "text-muted hover:text-primary-text"
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
          <div className="text-center py-12 bg-surface border border-border rounded-3xl">
            <p className="text-muted">
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
