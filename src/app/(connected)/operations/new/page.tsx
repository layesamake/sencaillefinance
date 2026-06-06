import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveAccounts } from "@/lib/queries/accounts";
import { getActiveParties } from "@/lib/queries/parties";
import OperationForm from "@/components/operations/OperationForm";

export default async function NewOperationPage() {
  const [categories, accounts, parties] = await Promise.all([
    getActiveCategories(),
    getActiveAccounts(),
    getActiveParties()
  ]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Nouvelle opération</h1>
        <p className="text-sm text-muted mt-1">
          Enregistrez une recette ou une dépense
        </p>
      </div>

      <OperationForm 
        categories={categories}
        accounts={accounts}
        parties={parties}
      />
    </div>
  );
}
