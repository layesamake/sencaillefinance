import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveAccounts } from "@/lib/queries/accounts";
import { getActiveParties } from "@/lib/queries/parties";
import NewOperationTabs from "@/components/operations/NewOperationTabs";
import Link from "next/link";
import { X } from "lucide-react";

export default async function NewOperationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [categories, accounts, parties] = await Promise.all([
    getActiveCategories(),
    getActiveAccounts(),
    getActiveParties()
  ]);

  const params = await searchParams;
  const defaultTab = params?.tab === "transfer" ? "transfer" : "operation";
  const defaultType = params?.type === "expense" ? "expense" : "income";

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Nouvelle opération</h1>
          <p className="text-sm text-muted mt-1">
            Enregistrez une recette, une dépense ou un transfert
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="p-2 rounded-xl bg-surface border border-border text-muted hover:text-primary-text hover:bg-surface-hover transition-colors"
          aria-label="Fermer"
        >
          <X size={20} strokeWidth={2.5} />
        </Link>
      </div>

      <NewOperationTabs 
        categories={categories}
        accounts={accounts}
        parties={parties}
        defaultTab={defaultTab}
        defaultType={defaultType}
      />
    </div>
  );
}
