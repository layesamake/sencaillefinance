import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import type { Profile } from "@/types/database";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return <div className="p-4 text-center">Profil introuvable</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Mon profil</h1>
        <p className="text-sm text-muted mt-1">
          Gérez vos informations personnelles et votre sécurité
        </p>
      </div>
      
      <div className="rounded-3xl bg-surface p-6 border border-border shadow-xl">
        <ProfileForm profile={profile as Profile} user={user} />
      </div>
    </div>
  );
}
