"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AccountType } from "@/types/database";

export async function createAccountAction(formData: FormData) {
  const name = formData.get("name") as string;
  const accountType = formData.get("account_type") as AccountType;
  const openingBalance = parseFloat(formData.get("opening_balance") as string);

  if (!name || !name.trim()) return { error: "Le nom est requis." };
  if (isNaN(openingBalance)) return { error: "Le solde initial est invalide." };

  const supabase = await createClient();

  const { error } = await supabase.from("accounts").insert({
    name: name.trim(),
    account_type: accountType,
    opening_balance: openingBalance,
    opening_date: new Date().toISOString(),
    status: "active"
  });

  if (error) {
    console.error("[createAccountAction]", error);
    return { error: "Erreur lors de la création du compte." };
  }

  revalidatePath("/settings/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAccountAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const accountType = formData.get("account_type") as AccountType;
  const openingBalance = parseFloat(formData.get("opening_balance") as string);

  if (!id || !name || !name.trim()) return { error: "Le nom est requis." };
  if (isNaN(openingBalance)) return { error: "Le solde initial est invalide." };

  const supabase = await createClient();

  const { error } = await supabase.from("accounts").update({
    name: name.trim(),
    account_type: accountType,
    opening_balance: openingBalance
  }).eq("id", id);

  if (error) {
    console.error("[updateAccountAction]", error);
    return { error: "Erreur lors de la mise à jour du compte." };
  }

  revalidatePath("/settings/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleAccountStatusAction(id: string, currentStatus: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await supabase.from("accounts").update({
    status: newStatus
  }).eq("id", id);

  if (error) {
    console.error("[toggleAccountStatusAction]", error);
    return { error: "Erreur lors du changement de statut." };
  }

  revalidatePath("/settings/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}
