"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full bg-red-950/20 border border-red-900/50 p-4 rounded-2xl flex items-center justify-between hover:bg-red-900/40 transition-all text-left mt-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
          <LogOut size={24} />
        </div>
        <div>
          <h3 className="font-bold text-red-400">Déconnexion</h3>
          <p className="text-sm text-red-500/70">Se déconnecter de l'application</p>
        </div>
      </div>
      <ChevronRight className="text-red-500/50" />
    </button>
  );
}
