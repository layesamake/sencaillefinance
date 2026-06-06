"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@/types/database";
import { updateUserRoleAction, toggleUserStatusAction } from "@/app/(connected)/settings/users/actions";
import UserModal from "./UserModal";

export default function UsersList({ profiles, currentUserId }: { profiles: Profile[], currentUserId: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setIsCreating(true)}
        className="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 border-dashed rounded-2xl text-gray-300 font-bold transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Ajouter un utilisateur
      </button>

      <div className="space-y-3">
        {profiles.map(profile => {
          const isMe = profile.id === currentUserId;

          return (
            <div key={profile.id} className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${profile.status === 'active' ? 'bg-gray-900 border-gray-800' : 'bg-gray-900/50 border-gray-800/50 opacity-60'}`}>
              <div>
                <h3 className="font-bold text-gray-100 flex items-center gap-2">
                  {profile.full_name}
                  {isMe && <span className="text-[10px] uppercase bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full">Vous</span>}
                  {profile.status === 'disabled' && <span className="text-[10px] uppercase bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full">Désactivé</span>}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{profile.phone || "Pas de numéro"}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-xl ${profile.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                  {profile.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>

                {!isMe && (
                  <>
                    <button 
                      disabled={isPending}
                      onClick={() => setEditingUser(profile)}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 rounded-xl transition-colors disabled:opacity-50"
                      title="Modifier les informations"
                    >
                      ✏️ Éditer
                    </button>
                    <button 
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await updateUserRoleAction(profile.id, profile.role === 'admin' ? 'user' : 'admin');
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Rendre {profile.role === 'admin' ? 'Utilisateur' : 'Admin'}
                    </button>
                    <button 
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await toggleUserStatusAction(profile.id, profile.status);
                        });
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 ${profile.status === 'active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                    >
                      {profile.status === 'active' ? 'Désactiver' : 'Activer'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCreating && <UserModal onClose={() => setIsCreating(false)} />}
      {editingUser && <UserModal profile={editingUser} onClose={() => setEditingUser(null)} />}
    </div>
  );
}
