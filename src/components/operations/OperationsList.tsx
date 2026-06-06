"use client";

import { useState } from "react";
import type { OperationWithDetails, Account } from "@/types/database";
import OperationCard from "./OperationCard";
import OperationDetailsModal from "./OperationDetailsModal";

interface OperationsListProps {
  operations: OperationWithDetails[];
  accounts: Account[];
}

export default function OperationsList({ operations, accounts }: OperationsListProps) {
  const [selectedOp, setSelectedOp] = useState<OperationWithDetails | null>(null);

  if (operations.length === 0) {
    return (
      <div className="text-center py-12 bg-surface border border-border rounded-3xl mt-6">
        <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-muted">Aucune opération trouvée avec ces filtres.</p>
      </div>
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
          onClose={() => setSelectedOp(null)} 
        />
      )}
    </>
  );
}
