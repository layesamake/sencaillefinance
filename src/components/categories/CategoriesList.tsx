"use client";

import { useState, useTransition } from "react";
import type { Category, OperationType } from "@/types/database";
import { toggleCategoryStatusAction } from "@/app/(connected)/categories/actions";
import CategoryForm from "./CategoryForm";
import EmptyState from "@/components/ui/EmptyState";

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
      <div className="flex gap-1 rounded-xl bg-surface p-1 border border-border">
        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "income"
              ? "bg-emerald-600 text-primary-text shadow-lg"
              : "text-muted hover:text-primary-text"
          }`}
        >
          Recettes ({incomeCount})
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "expense"
              ? "bg-red-600 text-primary-text shadow-lg"
              : "text-muted hover:text-primary-text"
          }`}
        >
          Dépenses ({expenseCount})
        </button>
      </div>

      {/* Bouton créer */}
      {isAdmin && (
        <button
          onClick={() => { setEditCategory(null); setShowForm(true); }}
          className="w-full rounded-xl bg-surface border border-dashed border-border py-3 text-sm font-medium text-muted hover:border-gray-500 hover:text-primary-text transition-all"
        >
          + Nouvelle catégorie
        </button>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <EmptyState
            title="Catégorie introuvable"
            description={`Vous n'avez pas encore créé de catégories pour les ${activeTab === 'income' ? 'recettes' : 'dépenses'}.`}
            icon={
              <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            action={isAdmin ? (
              <button
                onClick={() => { setEditCategory(null); setShowForm(true); }}
                className="px-6 py-3 mt-2 rounded-xl bg-accent text-primary-text font-medium hover:bg-accent-hover transition-colors"
              >
                Créer la première
              </button>
            ) : undefined}
          />
        ) : (
          filtered.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-xl bg-surface p-4 border transition-all ${
                cat.status === "inactive"
                  ? "border-border/50 opacity-60"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      cat.status === "active"
                        ? activeTab === "income"
                          ? "bg-success"
                          : "bg-danger"
                        : "bg-gray-600"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      cat.status === "inactive" ? "text-muted line-through" : "text-primary-text"
                    }`}>
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {cat.status === "active" ? "Active" : "Désactivée"}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-primary-text transition-colors"
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
                          ? "bg-surface-hover text-muted hover:bg-red-950 hover:text-danger"
                          : "bg-surface-hover text-muted hover:bg-emerald-950 hover:text-success"
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
