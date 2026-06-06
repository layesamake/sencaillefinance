"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import type { Category, OperationType } from "@/types/database";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/(connected)/categories/actions";

interface CategoryFormProps {
  category?: Category | null;
  defaultType: OperationType;
  onClose: () => void;
}

export default function CategoryForm({
  category,
  defaultType,
  onClose,
}: CategoryFormProps) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || "");
  const [type, setType] = useState<OperationType>(category?.operation_type || defaultType);
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
      formData.set("operation_type", type);

      let result;
      if (isEdit && category) {
        result = await updateCategoryAction(category.id, formData);
      } else {
        result = await createCategoryAction(formData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-100">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-300 mb-1.5">
              Nom de la catégorie
            </label>
            <input
              ref={inputRef}
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vente œufs de caille"
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Type (seulement en création) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Type d'opération
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                    type === "income"
                      ? "bg-emerald-600/20 border-emerald-600 text-emerald-400"
                      : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  Recette
                </button>
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                    type === "expense"
                      ? "bg-red-600/20 border-red-600 text-red-400"
                      : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  Dépense
                </button>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="rounded-xl bg-red-950/50 border border-red-900/50 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-800 border border-gray-700 py-3 text-sm font-medium text-gray-400 hover:bg-gray-750 hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className={`flex-1 rounded-xl py-3 text-sm font-medium text-white transition-all disabled:opacity-50 ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isPending
                ? "En cours..."
                : isEdit
                ? "Modifier"
                : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
