"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: string, newRole: "admin" | "user") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id === userId) {
    return { error: "Opération non autorisée." };
  }

  const { error } = await supabase.from("profiles").update({
    role: newRole
  }).eq("id", userId);

  if (error) {
    console.error("[updateUserRoleAction]", error);
    return { error: "Erreur lors de la mise à jour du rôle." };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function toggleUserStatusAction(userId: string, currentStatus: "active" | "disabled") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id === userId) {
    return { error: "Opération non autorisée." };
  }

  const newStatus = currentStatus === "active" ? "disabled" : "active";

  const { error } = await supabase.from("profiles").update({
    status: newStatus
  }).eq("id", userId);

  if (error) {
    console.error("[toggleUserStatusAction]", error);
    return { error: "Erreur lors du changement de statut." };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function createUserAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if current user is admin (security)
  if (!user) return { error: "Non connecté" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Accès refusé" };

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "admin" | "user";

  if (!fullName || !email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  // Create ephemeral client to sign up without modifying the current admin's session
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const ephemeralClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );

  const { data: newUser, error: signUpError } = await ephemeralClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (signUpError) {
    console.error("[createUserAction] signUp error:", signUpError);
    return { error: "Impossible de créer l'utilisateur (l'email est peut-être déjà pris)." };
  }

  // If role is admin, update it in profiles
  if (newUser?.user && role === "admin") {
    // We must wait a tiny bit to ensure the trigger created the profile
    await new Promise(resolve => setTimeout(resolve, 500));
    await supabase.from("profiles").update({ role: "admin" }).eq("id", newUser.user.id);
  }

  revalidatePath("/settings/users");
  return { success: true };
}

export async function updateUserProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non connecté" };
  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (currentProfile?.role !== "admin") return { error: "Accès refusé" };

  const id = formData.get("id") as string;
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as "admin" | "user";

  if (!id || !fullName) {
    return { error: "Le nom est obligatoire." };
  }

  const { error } = await supabase.from("profiles").update({
    full_name: fullName,
    phone: phone || null,
    role: role
  }).eq("id", id);

  if (error) {
    console.error("[updateUserProfileAction] error:", error);
    return { error: "Impossible de modifier l'utilisateur." };
  }

  revalidatePath("/settings/users");
  return { success: true };
}
