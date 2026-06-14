import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OperationForm from "@/components/operations/OperationForm";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveAccounts } from "@/lib/queries/accounts";
import { getActiveParties } from "@/lib/queries/parties";
import Link from "next/link";
import { X } from "lucide-react";

export default async function EditOperationPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the operation
  const { data: operation, error } = await supabase
    .from("operations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !operation) {
    redirect("/operations");
  }

  // Creator verification disabled for demo/admin purposes

  const [categories, accounts, parties] = await Promise.all([
    getActiveCategories(),
    getActiveAccounts(),
    getActiveParties()
  ]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Modifier l'opération</h1>
          <p className="text-sm text-muted mt-1">
            Veuillez noter que le type d'opération et le mode de règlement ne peuvent pas être modifiés.
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

      <OperationForm
        categories={categories}
        accounts={accounts}
        parties={parties}
        initialData={operation}
      />
    </div>
  );
}
