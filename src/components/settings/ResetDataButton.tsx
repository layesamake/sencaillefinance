"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { resetAllOperationsAction } from "@/app/(connected)/settings/reset-action";

export default function ResetDataButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    if (confirmText !== "CONFIRMER") return;

    setIsLoading(true);
    setError(null);

    const result = await resetAllOperationsAction();

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      setConfirmText("");
      setIsLoading(false);
      // Optional: show a success toast or reload page
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-danger/10 hover:bg-danger/20 border border-danger/20 text-danger p-4 rounded-2xl flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-danger/10 rounded-xl">
            <Trash2 size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold">Réinitialiser les données</h3>
            <p className="text-sm opacity-80">Supprimer toutes les opérations et paiements de test</p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 text-danger">
                  <div className="p-2 bg-danger/10 rounded-xl">
                    <AlertTriangle size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Zone de danger</h2>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setConfirmText("");
                  }}
                  className="p-2 hover:bg-surface-hover rounded-xl transition-colors"
                >
                  <X size={20} className="text-muted" />
                </button>
              </div>

              <div className="space-y-4 text-primary-text">
                <p>
                  Vous êtes sur le point de <strong className="text-danger">supprimer définitivement</strong> toutes vos opérations et tous vos paiements saisis dans l'application.
                </p>
                <p className="text-sm text-muted">
                  Vos catégories, comptes, clients et fournisseurs seront <strong>conservés</strong>. Cette action est <strong>irréversible</strong>.
                </p>

                <div className="mt-6 pt-6 border-t border-border">
                  <label className="block text-sm font-medium mb-2">
                    Tapez <strong className="text-danger select-none">CONFIRMER</strong> ci-dessous :
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="CONFIRMER"
                    className="w-full bg-surface-hover border border-border rounded-xl px-4 py-3 focus:border-danger focus:ring-1 focus:ring-danger outline-none transition-all uppercase"
                  />
                </div>

                {error && (
                  <p className="text-danger text-sm font-medium mt-2">{error}</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-surface-hover border-t border-border flex gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setConfirmText("");
                }}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-primary-text hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                disabled={confirmText !== "CONFIRMER" || isLoading}
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-danger hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Tout supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
