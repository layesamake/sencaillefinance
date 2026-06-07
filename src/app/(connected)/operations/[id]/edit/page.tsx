import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OperationForm from "@/components/operations/OperationForm";
import { getActiveCategories } from "@/lib/queries/categories";
import { getActiveAccounts } from "@/lib/queries/accounts";
import { getActiveParties } from "@/lib/queries/parties";

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

  // Verify the user is the creator
  if (operation.created_by !== user.id) {
    return (
      <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        <div className="bg-red-950/50 border border-red-900/50 p-6 rounded-2xl text-center">
          <h1 className="text-xl font-bold text-danger mb-2">Non autorisé</h1>
          <p className="text-red-300">Vous ne pouvez modifier que les opérations que vous avez vous-même saisies.</p>
        </div>
      </div>
    );
  }

  const [categories, accounts, parties] = await Promise.all([
    getActiveCategories(),
    getActiveAccounts(),
    getActiveParties()
  ]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Modifier l'opération</h1>
        <p className="text-sm text-muted mt-1">
          Veuillez noter que le type d'opération et le mode de règlement ne peuvent pas être modifiés.
        </p>
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
