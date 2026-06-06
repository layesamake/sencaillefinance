"use client";

import { useState, useTransition } from "react";
import type { Category, OperationType } from "@/types/database";
import { toggleCategoryStatusAction } from "@/app/(connected)/categories/actions";
import CategoryForm from "./CategoryForm";

interface CategoriesListProps {
  categories: Category[];
  isAdmin: boolean;
}

export default function CategoriesList({ categories, isAdmin }: CategoriesListProps) {
  const [activeTab, setActiveTab] = useState<OperationType>("income");
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = categories.filter((c) => c.operation_type === activeTab);
  const incomeCount = categories.filter((c) => c.operation_type === "income").length;
  const expenseCount = categories.filter((c) => c.operation_type === "expense").length;

  const handleToggleStatus = (cat: Category) => {
    startTransition(async () => {
      await toggleCategoryStatusAction(cat.id, cat.status);
    });
  };

  const handleEdit = (cat: Category) => {
    setEditCategory(cat);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditCategory(null);
  };

  return (
    <div className="space-y-4">
      {/* Onglets */}
      <div className="flex gap-1 rounded-xl bg-gray-900 p-1 border border-gray-800">
        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "income"
              ? "bg-emerald-600 text-white shadow-lg"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Recettes ({incomeCount})
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "expense"
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Dépenses ({expenseCount})
        </button>
      </div>

      {/* Bouton créer */}
      {isAdmin && (
        <button
          onClick={() => { setEditCategory(null); setShowForm(true); }}
          className="w-full rounded-xl bg-gray-900 border border-dashed border-gray-700 py-3 text-sm font-medium text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-all"
        >
          + Nouvelle catégorie
        </button>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-gray-900 p-8 text-center border border-gray-800">
            <p className="text-gray-500">Aucune catégorie trouvée.</p>
          </div>
        ) : (
          filtered.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-xl bg-gray-900 p-4 border transition-all ${
                cat.status === "inactive"
                  ? "border-gray-800/50 opacity-60"
                  : "border-gray-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      cat.status === "active"
                        ? activeTab === "income"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                        : "bg-gray-600"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      cat.status === "inactive" ? "text-gray-500 line-through" : "text-gray-100"
                    }`}>
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cat.status === "active" ? "Active" : "Désactivée"}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
                      title="Modifier"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      disabled={isPending}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                        cat.status === "active"
                          ? "bg-gray-800 text-gray-400 hover:bg-red-950 hover:text-red-400"
                          : "bg-gray-800 text-gray-400 hover:bg-emerald-950 hover:text-emerald-400"
                      }`}
                    >
                      {cat.status === "active" ? "Désactiver" : "Réactiver"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <CategoryForm
          category={editCategory}
          defaultType={activeTab}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
