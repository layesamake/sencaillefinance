import { notFound } from "next/navigation";
import { getPartyDetails } from "@/lib/queries/parties";
import { getOperations } from "@/lib/queries/operations";
import { getActiveAccounts } from "@/lib/queries/accounts";
import PartyHeader from "@/components/parties/PartyHeader";
import OperationsList from "@/components/operations/OperationsList";

export default async function PartyDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const [party, accounts] = await Promise.all([
    getPartyDetails(id),
    getActiveAccounts()
  ]);

  if (!party) {
    notFound();
  }

  // Fetch operations for this party only
  const operations = await getOperations({ partyId: id });

  // Calculate outstanding balance
  const totalOwed = operations.reduce((sum, op) => {
    const sumPayments = op.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
    const paid = op.initial_paid_amount + sumPayments;
    const remaining = op.total_amount - paid;
    return sum + (remaining > 0 ? remaining : 0);
  }, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <PartyHeader party={party} totalOwed={totalOwed} />

      <div className="pt-4">
        <h2 className="text-lg font-bold text-gray-100 mb-4">Historique des opérations</h2>
        {operations.length > 0 ? (
          <OperationsList operations={operations} accounts={accounts} />
        ) : (
          <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-3xl">
            <p className="text-gray-500">Aucune opération pour ce tiers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
