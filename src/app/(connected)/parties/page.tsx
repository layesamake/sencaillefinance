import { getActiveParties } from "@/lib/queries/parties";
import PartiesList from "@/components/parties/PartiesList";
import { createClient } from "@/lib/supabase/server";

export default async function PartiesPage() {
  const parties = await getActiveParties();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  const userRole = profile?.role || "user";

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Annuaire des tiers</h1>
        <p className="text-sm text-muted mt-1">
          Gérez vos clients et fournisseurs
        </p>
      </div>

      <PartiesList parties={parties} userRole={userRole} />
    </div>
  );
}
