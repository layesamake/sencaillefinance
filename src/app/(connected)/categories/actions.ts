"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OperationType } from "@/types/database";

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const operationType = formData.get("operation_type") as OperationType;

  if (!name || !name.trim()) {
    return { error: "Le nom de la catégorie est obligatoire." };
  }

  if (!operationType || !["income", "expense"].includes(operationType)) {
    return { error: "Le type d'opération est invalide." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Utilisateur non connecté." };
  }

  // Vérifier les doublons exacts
  const { data: existing } = await supabase
    .from("categories")
    .select("id, name")
    .eq("operation_type", operationType)
    .ilike("name", name.trim());

  if (existing && existing.length > 0) {
    return { error: `Une catégorie avec ce nom existe déjà : "${existing[0].name}".` };
  }

  const { data, error } = await supabase.from("categories").insert({
    name: name.trim(),
    operation_type: operationType,
    created_by: user.id,
  }).select().single();

  if (error) {
    console.error("[createCategoryAction] Erreur:", error);
    return { error: "Erreur lors de la création de la catégorie." };
  }

  revalidatePath("/categories");
  return { success: true, category: data };
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;

  if (!name || !name.trim()) {
    return { error: "Le nom de la catégorie est obligatoire." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim() })
    .eq("id", id);

  if (error) {
    console.error("[updateCategoryAction] Erreur:", error);
    return { error: "Erreur lors de la modification de la catégorie." };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function toggleCategoryStatusAction(id: string, currentStatus: string) {
  const newStatus = currentStatus === "active" ? "inactive" : "active";

  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error("[toggleCategoryStatusAction] Erreur:", error);
    return { error: "Erreur lors du changement de statut." };
  }

  revalidatePath("/categories");
  return { success: true, newStatus };
}
