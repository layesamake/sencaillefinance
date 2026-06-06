import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries/categories";
import CategoriesList from "@/components/categories/CategoriesList";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const categories = await getCategories();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-text">Catégories</h1>
        <span className="text-sm text-muted">{categories.length} au total</span>
      </div>
      <CategoriesList categories={categories} isAdmin={isAdmin} />
    </div>
  );
}
