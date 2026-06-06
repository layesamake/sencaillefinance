"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAdminProfile() {
  console.log("--> ACTION createAdminProfile a été déclenchée !");
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Utilisateur non connecté dans l'action");
    throw new Error("Utilisateur non connecté");
  }

  console.log("--> Tentative d'insertion du profil pour user:", user.id);
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    role: "admin",
    status: "active",
    full_name: user.email?.split('@')[0] || "Administrateur"
  });

  if (error) {
    console.error("Erreur lors de la création du profil:", error);
    throw new Error("Erreur de création de profil");
  }

  revalidatePath("/", "layout");
}
