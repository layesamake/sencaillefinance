"use client";

import { useState, useTransition } from "react";
import { createUserAction, updateUserProfileAction } from "@/app/(connected)/settings/users/actions";
import type { Profile } from "@/types/database";

interface Props {
  profile?: Profile;
  onClose: () => void;
}

export default function UserModal({ profile, onClose }: Props) {
  const isEditing = !!profile;
  
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [role, setRole] = useState<"admin" | "user">(profile?.role || "user");
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("full_name", fullName);
      formData.set("role", role);
      if (phone) formData.set("phone", phone);

      if (isEditing) {
        formData.set("id", profile.id);
        const res = await updateUserProfileAction(formData);
        if (res?.error) setError(res.error);
        else onClose();
      } else {
        formData.set("email", email);
        formData.set("password", password);
        const res = await createUserAction(formData);
        if (res?.error) setError(res.error);
        else onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-primary-text">
            {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-primary-text">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-950/50 text-danger text-sm rounded-xl border border-red-900/50">{error}</div>}
          
          <div>
            <label className="block text-sm text-muted mb-1">Nom complet</label>
            <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jean Dupont" className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Numéro de téléphone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optionnel" className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none" />
          </div>

          {!isEditing && (
            <>
              <div>
                <label className="block text-sm text-muted mb-1">Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@sencaille.com" className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1">Mot de passe (provisoire)</label>
                <input required type="text" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 caractères" className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-muted mb-1">Rôle</label>
            <select value={role} onChange={e => setRole(e.target.value as "admin"|"user")} className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none">
              <option value="user">Utilisateur (Employé)</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <button type="submit" disabled={isPending} className="w-full py-3 bg-accent hover:bg-accent-hover rounded-xl text-primary-text font-bold transition-all disabled:opacity-50 mt-2">
            {isPending ? "Enregistrement..." : (isEditing ? "Enregistrer" : "Créer le compte")}
          </button>
        </form>
      </div>
    </div>
  );
}
