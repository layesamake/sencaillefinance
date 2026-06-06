"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@/types/database";
import { updateProfileAction } from "@/app/(connected)/profile/actions";
import { User } from "@supabase/supabase-js";

interface ProfileFormProps {
  profile: Profile;
  user: User;
}

export default function ProfileForm({ profile, user }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("fullName", fullName);
      formData.set("phone", phone);
      if (password) formData.set("password", password);

      const result = await updateProfileAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setPassword("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-3 bg-red-950/50 text-red-400 text-sm rounded-xl border border-red-900/50">{error}</div>}
      {success && <div className="p-3 bg-emerald-950/50 text-emerald-400 text-sm rounded-xl border border-emerald-900/50">Profil mis à jour avec succès.</div>}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Email (non modifiable)</label>
        <input type="email" disabled value={user.email || ""} className="w-full rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Rôle</label>
        <div className="w-full rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 text-sm text-gray-400 font-semibold">
          {profile.role === "admin" ? "Administrateur" : "Utilisateur simple"}
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm text-gray-400 mb-1">Nom complet</label>
        <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Téléphone</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-blue-500" />
      </div>

      <div className="pt-4 border-t border-gray-800">
        <label className="block text-sm text-gray-400 mb-1">Nouveau mot de passe (optionnel)</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Laissez vide pour ne pas changer" minLength={6} className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-blue-500" />
      </div>

      <button type="submit" disabled={isPending} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-all disabled:opacity-50 mt-4">
        {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
