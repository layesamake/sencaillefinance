import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  console.log("--> API /api/fix-profile déclenchée !");
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Utilisateur non connecté dans l'API");
      return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
    }

    console.log("--> API: Tentative d'insertion du profil pour user:", user.id);
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      role: "admin",
      status: "active",
      full_name: user.email?.split('@')[0] || "Administrateur"
    });

    if (error) {
      console.error("API Erreur lors de la création du profil:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("--> API: Profil créé avec succès !");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Erreur inattendue:", err);
    return NextResponse.json({ error: err.message || "Erreur interne" }, { status: 500 });
  }
}
