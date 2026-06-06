"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePartyAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const partyType = formData.get("party_type") as string;
  
  if (!id || !name || !name.trim()) {
    return { error: "L'ID et le nom sont obligatoires." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("parties")
    .update({
      name: name.trim(),
      phone: phone ? phone.trim() : null,
      party_type: partyType,
    })
    .eq("id", id);

  if (error) {
    console.error("[updatePartyAction] Erreur:", error);
    return { error: "Erreur lors de la mise à jour du tiers." };
  }

  revalidatePath("/parties");
  revalidatePath(`/parties/${id}`);
  
  return { success: true };
}
