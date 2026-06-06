import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllProfiles] Erreur:", error);
    return [];
  }

  return data as Profile[];
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}
