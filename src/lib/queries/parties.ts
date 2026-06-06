import { createClient } from "@/lib/supabase/server";
import type { Party, PartyType } from "@/types/database";

/**
 * Récupère les clients ou fournisseurs actifs.
 * Si aucun type n'est fourni, récupère tous les tiers.
 */
export async function getActiveParties(type?: "customer" | "supplier"): Promise<Party[]> {
  const supabase = await createClient();

  let query = supabase
    .from("parties")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (type) {
    // Si on veut les clients, on prend les type "customer" ET "both"
    // Si on veut les fournisseurs, on prend les type "supplier" ET "both"
    query = query.in("party_type", [type, "both"]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getActiveParties] Erreur:", error);
    return [];
  }

  return data as Party[];
}
