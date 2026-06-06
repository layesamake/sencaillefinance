"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import type { Party, PartyType } from "@/types/database";
import { createPartyAction } from "@/app/(connected)/operations/actions";

interface QuickPartyModalProps {
  partyType: PartyType;
  onCreated: (party: Party) => void;
  onClose: () => void;
}

export default function QuickPartyModal({
  partyType,
  onCreated,
  onClose,
}: QuickPartyModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("party_type", partyType);
      if (phone.trim()) formData.set("phone", phone.trim());

      const result = await createPartyAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.party) {
        onCreated(result.party as Party);
      }
    });
  };

  const typeLabel = partyType === "customer" ? "client" : "fournisseur";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-100">
            Nouveau {typeLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="party-name" className="block text-sm font-medium text-gray-300 mb-1.5">
              Nom complet
            </label>
            <input
              ref={inputRef}
              id="party-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Amadou Diop"
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="party-phone" className="block text-sm font-medium text-gray-300 mb-1.5">
              Téléphone <span className="text-gray-500 font-normal">(Facultatif)</span>
            </label>
            <input
              id="party-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 77 123 45 67"
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-950/50 border border-red-900/50 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-800 border border-gray-700 py-3 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-medium text-white transition-all disabled:opacity-50"
            >
              {isPending ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
