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

export async function submitPaymentAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  const operationId = formData.get("operation_id") as string;
  const accountId = formData.get("account_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const paymentDate = formData.get("payment_date") as string;
  const description = formData.get("description") as string;

  if (!operationId || !accountId || !amount || !paymentDate) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (amount <= 0) {
    return { error: "Le montant doit être supérieur à zéro." };
  }

  // Vérifier que le montant ne dépasse pas le reste à payer
  const { data: op } = await supabase
    .from("operations")
    .select('total_amount, initial_paid_amount, payments(amount, status)')
    .eq('id', operationId)
    .single();

  if (op) {
    const sumPayments = op.payments?.filter((p: any) => p.status === 'active').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    const restant = op.total_amount - op.initial_paid_amount - sumPayments;
    
    if (amount > restant) {
      return { error: `Le montant (${amount} F) dépasse le reste à payer (${restant} F).` };
    }
  }

  const { error } = await supabase.from("payments").insert({
    operation_id: operationId,
    account_id: accountId,
    amount,
    payment_date: paymentDate,
    description: description ? description.trim() : null,
    created_by: user.id
  });

  if (error) {
    console.error("[submitPaymentAction] Erreur:", error);
    return { error: "Erreur lors de l'enregistrement du paiement." };
  }

  revalidatePath("/");
  revalidatePath("/operations");
  
  return { success: true };
}

export async function deletePaymentAction(paymentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  const { error } = await supabase.from("payments").update({
    status: "deleted",
    deleted_by: user.id,
    deleted_at: new Date().toISOString()
  }).eq("id", paymentId);

  if (error) {
    console.error("[deletePaymentAction] Erreur:", error);
    return { error: "Erreur lors de la suppression du paiement." };
  }

  revalidatePath("/");
  revalidatePath("/operations");
  revalidatePath("/credits");
  revalidatePath("/dashboard");
  
  return { success: true };
}
