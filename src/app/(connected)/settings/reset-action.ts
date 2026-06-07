"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetAllOperationsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non autorisé" };
  }

  try {
    // 1. Hard delete des paiements de l'utilisateur
    const { error: paymentsError } = await supabase
      .from("payments")
      .delete()
      .eq("created_by", user.id);

    if (paymentsError) {
      console.error("[resetAllOperationsAction] Erreur suppression paiements:", paymentsError);
      return { error: "Erreur lors de la suppression des paiements." };
    }

    // 2. Hard delete des opérations de l'utilisateur
    const { error: operationsError } = await supabase
      .from("operations")
      .delete()
      .eq("created_by", user.id);

    if (operationsError) {
      console.error("[resetAllOperationsAction] Erreur suppression opérations:", operationsError);
      return { error: "Erreur lors de la suppression des opérations." };
    }

    // Revalider toutes les pages principales
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/operations");
    revalidatePath("/credits");
    revalidatePath("/reports");

    return { success: true };
  } catch (error) {
    console.error("[resetAllOperationsAction] Erreur inattendue:", error);
    return { error: "Une erreur inattendue est survenue." };
  }
}
