"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OperationType, SettlementMode } from "@/types/database";

export async function createPartyAction(formData: FormData) {
  const name = formData.get("name") as string;
  const partyType = formData.get("party_type") as "customer" | "supplier" | "both";
  const phone = formData.get("phone") as string;

  if (!name || !name.trim()) {
    return { error: "Le nom est obligatoire." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  const { data, error } = await supabase.from("parties").insert({
    name: name.trim(),
    party_type: partyType,
    phone: phone ? phone.trim() : null,
    created_by: user.id
  }).select().single();

  if (error) {
    console.error("[createPartyAction] Erreur:", error);
    return { error: "Erreur lors de la création du contact." };
  }

  return { success: true, party: data };
}

export async function submitOperationAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  const operationType = formData.get("operation_type") as OperationType;
  const categoryId = formData.get("category_id") as string;
  const totalAmount = parseFloat(formData.get("total_amount") as string);
  const settlementMode = formData.get("settlement_mode") as SettlementMode;
  const initialPaidAmount = parseFloat(formData.get("initial_paid_amount") as string);
  const initialAccountId = formData.get("initial_account_id") as string;
  const partyId = formData.get("party_id") as string;
  const operationDate = formData.get("operation_date") as string;
  const description = formData.get("description") as string;

  // Validation de base
  if (!operationType || !categoryId || !totalAmount || !settlementMode || !operationDate) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (totalAmount <= 0) {
    return { error: "Le montant total doit être supérieur à zéro." };
  }

  // Vérifications métiers strictes (reproduisent les CHECK du SQL)
  if (settlementMode === "paid") {
    if (initialPaidAmount !== totalAmount) return { error: "Pour un paiement total, le montant payé doit être égal au montant total." };
    if (!initialAccountId) return { error: "Veuillez sélectionner un moyen de paiement." };
  } else if (settlementMode === "credit") {
    if (initialPaidAmount !== 0) return { error: "Pour un achat à crédit, le montant payé doit être zéro." };
    if (!partyId) return { error: "Veuillez sélectionner un client ou fournisseur." };
  } else if (settlementMode === "partial") {
    if (initialPaidAmount <= 0 || initialPaidAmount >= totalAmount) return { error: "Le montant payé doit être strictement compris entre 0 et le montant total." };
    if (!initialAccountId) return { error: "Veuillez sélectionner un moyen de paiement." };
    if (!partyId) return { error: "Veuillez sélectionner un client ou fournisseur." };
  }

  // Insertion
  const { error } = await supabase.from("operations").insert({
    operation_type: operationType,
    category_id: categoryId,
    total_amount: totalAmount,
    settlement_mode: settlementMode,
    initial_paid_amount: initialPaidAmount,
    initial_account_id: initialAccountId || null,
    party_id: partyId || null,
    operation_date: operationDate,
    description: description ? description.trim() : null,
    created_by: user.id
  });

  if (error) {
    console.error("[submitOperationAction] Erreur:", error);
    return { error: "Erreur lors de l'enregistrement de l'opération." };
  }

  revalidatePath("/");
  revalidatePath("/operations");
  
  return { success: true };
}
