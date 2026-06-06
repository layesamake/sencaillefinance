"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!fullName || !fullName.trim()) {
    return { error: "Le nom complet est obligatoire." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName.trim(),
      phone: phone ? phone.trim() : null,
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Erreur lors de la mise à jour du profil." };
  }

  if (password && password.trim().length >= 6) {
    const { error: authError } = await supabase.auth.updateUser({
      password: password.trim()
    });
    if (authError) {
      return { error: "Profil mis à jour, mais erreur avec le mot de passe." };
    }
  }

  revalidatePath("/profile");
  return { success: true };
}
