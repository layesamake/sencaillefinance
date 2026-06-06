"use client";

import { useState } from "react";
import { createAdminProfile } from "@/app/(connected)/actions";

export default function CreateProfileButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fix-profile", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }
      
      // Si la page ne se rafraîchit pas automatiquement, on force le rechargement
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 rounded-lg bg-red-950/80 p-3 text-sm text-red-400 border border-red-900">
          {error}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 transition-colors"
      >
        {loading ? "Création en cours..." : "Créer mon profil administrateur"}
      </button>
    </div>
  );
}
