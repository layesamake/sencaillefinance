import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import SmartFAB from "@/components/layout/SmartFAB";

export default async function ConnectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status, full_name")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code === "PGRST116") {
    // Auto-create admin profile if it doesn't exist
    console.log("[layout] Profil introuvable, création automatique...");
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      role: "admin",
      status: "active",
      full_name: user.email?.split("@")[0] || "Administrateur",
    });

    if (insertError) {
      console.error("[layout] Erreur création profil:", insertError);
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <div className="w-full max-w-sm rounded-xl bg-red-950/50 p-6 text-center border border-red-900/50">
            <h1 className="text-lg font-bold mb-2 text-danger">Erreur de Profil</h1>
            <p className="mb-4 text-sm text-red-300">
              Impossible de créer votre profil automatiquement.
            </p>
            <p className="text-xs text-danger/70 font-mono break-all">
              {insertError.message}
            </p>
          </div>
        </div>
      );
    }

    // Re-fetch the freshly created profile
    const { data: newProfile } = await supabase
      .from("profiles")
      .select("role, status, full_name")
      .eq("id", user.id)
      .single();

    if (!newProfile) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <div className="w-full max-w-sm rounded-xl bg-red-950/50 p-6 text-center border border-red-900/50">
            <h1 className="text-lg font-bold mb-2 text-danger">Erreur de Profil</h1>
            <p className="text-sm text-red-300">
              Le profil a été créé mais ne peut pas être relu. Rafraîchissez la page.
            </p>
          </div>
        </div>
      );
    }

    // Use newProfile for the rest of the render
    return (
      <>
        <TopBar role={newProfile.role} fullName={newProfile.full_name} />
        <main className="flex-1 pt-16 pb-16 min-h-screen bg-background text-primary-text">
          {children}
        </main>
        <SmartFAB />
        <BottomNav />
      </>
    );
  }

  const mockProfile = profile || { role: "admin", status: "active", full_name: "Mock User" };

  if (mockProfile.status === "disabled") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm rounded-xl bg-red-950/50 p-6 text-center border border-red-900/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/30 mb-4">
            <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold mb-2 text-danger">Accès bloqué</h1>
          <p className="mb-6 text-sm text-red-300">Votre compte a été désactivé. Veuillez contacter l'administrateur.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar role={mockProfile.role} fullName={mockProfile.full_name} />
      <main className="flex-1 pt-16 pb-16 min-h-screen bg-background text-primary-text transition-colors duration-300">
        {children}
      </main>
      <SmartFAB />
      <BottomNav />
    </>
  );
}
