"use client";

import { useState } from "react";
import OperationForm from "./OperationForm";
import TransferForm from "./TransferForm";
import type { Category, Account, Party } from "@/types/database";

interface NewOperationTabsProps {
  categories: Category[];
  accounts: Account[];
  parties: Party[];
  defaultTab?: "operation" | "transfer";
}

export default function NewOperationTabs({ categories, accounts, parties, defaultTab = "operation" }: NewOperationTabsProps) {
  const [activeTab, setActiveTab] = useState<"operation" | "transfer">(defaultTab);

  return (
    <div className="space-y-6">
      <div className="flex bg-surface border border-border rounded-xl p-1">
        <button
          onClick={() => setActiveTab("operation")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "operation" ? "bg-surface-hover text-primary-text shadow-sm" : "text-muted hover:text-primary-text"
          }`}
        >
          Opération Standard
        </button>
        <button
          onClick={() => setActiveTab("transfer")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "transfer" ? "bg-surface-hover text-primary-text shadow-sm" : "text-muted hover:text-primary-text"
          }`}
        >
          Transfert de Compte
        </button>
      </div>

      {activeTab === "operation" ? (
        <OperationForm categories={categories} accounts={accounts} parties={parties} />
      ) : (
        <TransferForm accounts={accounts} />
      )}
    </div>
  );
}
