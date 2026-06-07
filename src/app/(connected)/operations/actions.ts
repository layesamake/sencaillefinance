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

export async function submitTransferAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  const sourceAccountId = formData.get("source_account_id") as string;
  const destinationAccountId = formData.get("destination_account_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const transferDate = formData.get("transfer_date") as string;
  const description = formData.get("description") as string;

  if (!sourceAccountId || !destinationAccountId || !amount || !transferDate) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (sourceAccountId === destinationAccountId) {
    return { error: "Les comptes source et destination doivent être différents." };
  }

  if (amount <= 0) {
    return { error: "Le montant doit être supérieur à zéro." };
  }

  // 1. Get or create Categories
  const getOrCreateCategory = async (name: string, type: "income" | "expense") => {
    let { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("name", name)
      .eq("operation_type", type)
      .eq("status", "active")
      .single();
    
    if (!cat) {
      const { data: newCat, error } = await supabase.from("categories").insert({
        name,
        operation_type: type,
        status: "active",
        created_by: user.id
      }).select("id").single();
      
      if (error) throw new Error("Erreur création catégorie");
      cat = newCat;
    }
    return cat.id;
  };

  try {
    const expenseCatId = await getOrCreateCategory("Virement Interne (Sortie)", "expense");
    const incomeCatId = await getOrCreateCategory("Virement Interne (Entrée)", "income");

    // 2. Fetch account names for description if not provided
    const { data: sourceAcc } = await supabase.from("accounts").select("name").eq("id", sourceAccountId).single();
    const { data: destAcc } = await supabase.from("accounts").select("name").eq("id", destinationAccountId).single();

    const descExpense = description ? `Transfert: ${description}` : `Transfert vers ${destAcc?.name || "autre compte"}`;
    const descIncome = description ? `Transfert: ${description}` : `Transfert depuis ${sourceAcc?.name || "autre compte"}`;

    // 3. Create Expense
    const { error: errorOut } = await supabase.from("operations").insert({
      operation_type: "expense",
      category_id: expenseCatId,
      total_amount: amount,
      settlement_mode: "paid",
      initial_paid_amount: amount,
      initial_account_id: sourceAccountId,
      party_id: null,
      operation_date: transferDate,
      description: descExpense,
      created_by: user.id
    });

    if (errorOut) throw errorOut;

    // 4. Create Income
    const { error: errorIn } = await supabase.from("operations").insert({
      operation_type: "income",
      category_id: incomeCatId,
      total_amount: amount,
      settlement_mode: "paid",
      initial_paid_amount: amount,
      initial_account_id: destinationAccountId,
      party_id: null,
      operation_date: transferDate,
      description: descIncome,
      created_by: user.id
    });

    if (errorIn) throw errorIn;

  } catch (error: any) {
    console.error("[submitTransferAction] Erreur:", error);
    return { error: "Erreur lors du transfert." };
  }

  revalidatePath("/");
  revalidatePath("/operations");
  
  return { success: true };
}

export async function deleteOperationAction(operationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  // Vérifier si l'utilisateur est le créateur
  const { data: op } = await supabase.from("operations").select("created_by").eq("id", operationId).single();
  if (!op || op.created_by !== user.id) {
    return { error: "Non autorisé" };
  }

  // Soft delete de l'opération
  const { error: opError } = await supabase.from("operations").update({
    status: "deleted",
    deleted_by: user.id,
    deleted_at: new Date().toISOString()
  }).eq("id", operationId);

  if (opError) {
    console.error("[deleteOperationAction] Erreur:", opError);
    return { error: "Erreur lors de la suppression de l'opération." };
  }

  // Soft delete des paiements associés
  await supabase.from("payments").update({
    status: "deleted",
    deleted_by: user.id,
    deleted_at: new Date().toISOString()
  }).eq("operation_id", operationId).eq("status", "active");

  revalidatePath("/");
  revalidatePath("/operations");
  revalidatePath("/dashboard");
  revalidatePath("/credits");

  return { success: true };
}

export async function updateOperationAction(operationId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };

  const { data: op } = await supabase.from("operations")
    .select("created_by, initial_paid_amount, payments(amount, status)")
    .eq("id", operationId).single();

  if (!op || op.created_by !== user.id) {
    return { error: "Non autorisé" };
  }

  const categoryId = formData.get("category_id") as string;
  const totalAmount = parseFloat(formData.get("total_amount") as string);
  const partyId = formData.get("party_id") as string;
  const operationDate = formData.get("operation_date") as string;
  const description = formData.get("description") as string;

  if (!categoryId || !totalAmount || !operationDate) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (totalAmount <= 0) {
    return { error: "Le montant total doit être supérieur à zéro." };
  }

  // Vérification de la cohérence avec les paiements existants
  const sumPayments = op.payments?.filter((p: any) => p.status === 'active').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalDejaPaye = op.initial_paid_amount + sumPayments;

  if (totalAmount < totalDejaPaye) {
    return { error: `Le nouveau montant total (${totalAmount} F) ne peut pas être inférieur au montant déjà payé (${totalDejaPaye} F).` };
  }

  const updateData = {
    category_id: categoryId,
    total_amount: totalAmount,
    party_id: partyId || null,
    operation_date: operationDate,
    description: description ? description.trim() : null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("operations").update(updateData).eq("id", operationId);

  if (error) {
    console.error("[updateOperationAction] Erreur:", error);
    return { error: "Erreur lors de la modification de l'opération." };
  }

  revalidatePath("/");
  revalidatePath("/operations");
  revalidatePath("/dashboard");
  revalidatePath("/credits");

  return { success: true };
}
