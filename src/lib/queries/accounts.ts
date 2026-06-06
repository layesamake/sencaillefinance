import { createClient } from "@/lib/supabase/server";
import type { Account } from "@/types/database";

/**
 * Récupère les comptes financiers actifs.
 */
export async function getActiveAccounts(): Promise<Account[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) {
    console.error("[getActiveAccounts] Erreur:", error);
    return [];
  }

  return data as Account[];
}
