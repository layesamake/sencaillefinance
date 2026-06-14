"use client";

import { useState } from "react";
import type { OperationWithDetails, Account } from "@/types/database";
import OperationCard from "./OperationCard";
import OperationDetailsModal from "./OperationDetailsModal";
import EmptyState from "@/components/ui/EmptyState";

interface OperationsListProps {
  operations: OperationWithDetails[];
  accounts: Account[];
  currentUserId?: string;
}

export default function OperationsList({ operations, accounts, currentUserId }: OperationsListProps) {
  const [selectedOp, setSelectedOp] = useState<OperationWithDetails | null>(null);

  if (operations.length === 0) {
    return (
      <EmptyState
        title="Aucune opération trouvée"
        description="Il semble n'y avoir aucune donnée correspondant à vos filtres. Essayez de modifier votre recherche."
        icon={
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-3 mt-6">
        {operations.map((op) => (
          <OperationCard 
            key={op.id} 
            operation={op} 
            onClick={() => setSelectedOp(op)} 
          />
        ))}
      </div>

      {selectedOp && (
        <OperationDetailsModal 
          operation={selectedOp} 
          accounts={accounts}
          currentUserId={currentUserId}
          onClose={() => setSelectedOp(null)} 
        />
      )}
    </>
  );
}
