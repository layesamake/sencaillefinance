"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/database";

interface OperationsFiltersProps {
  categories: Category[];
}

export default function OperationsFilters({ categories }: OperationsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Valeurs actuelles des filtres depuis l'URL
  const currentPeriod = searchParams.get("period") || "this_month";
  const currentType = searchParams.get("type") || "all";
  const currentCategoryId = searchParams.get("categoryId") || "all";
  const currentSettlementMode = searchParams.get("settlementMode") || "all";
  const currentPaymentStatus = searchParams.get("paymentStatus") || "all";
  const currentSearchParam = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearchParam);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentSearchParam) {
        updateFilter("search", searchTerm);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, currentSearchParam]);

  // Catégories filtrées selon le type sélectionné
  const filteredCategories = categories.filter(c => 
    currentType === "all" ? true : c.operation_type === currentType
  );

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Si on change le type et que la catégorie actuelle n'est pas du bon type, on reset la catégorie
    if (key === "type" && value !== "all") {
      const cat = categories.find(c => c.id === currentCategoryId);
      if (cat && cat.operation_type !== value) {
        params.delete("categoryId");
      }
    }

    router.push(`/operations?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    router.push(`/operations`);
  };

  return (
    <>
      <div className="mb-3 relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Rechercher (mot-clé, catégorie, tiers)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-primary-text focus:border-accent outline-none transition-colors"
        />
      </div>

      <div className="flex justify-between items-center bg-surface p-4 rounded-2xl border border-border">
        <div className="text-sm font-medium text-primary-text">
          Filtre: <span className="text-primary-text">{currentPeriod === 'this_month' ? 'Ce mois-ci' : currentPeriod === 'today' ? "Aujourd'hui" : currentPeriod === 'all' ? 'Toutes les dates' : currentPeriod}</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-surface-hover hover:bg-gray-700 text-primary-text px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtres
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:w-96 bg-surface border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="text-lg font-bold text-primary-text">Filtrer les opérations</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted hover:text-primary-text">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Période */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Période</label>
                <select
                  value={currentPeriod}
                  onChange={(e) => updateFilter("period", e.target.value)}
                  className="w-full bg-surface-hover border border-border rounded-xl px-4 py-3 text-sm text-primary-text focus:border-accent outline-none"
                >
                  <option value="today">Aujourd'hui</option>
                  <option value="this_month">Ce mois</option>
                  <option value="last_month">Mois dernier</option>
                  <option value="all">Toutes les dates</option>
                </select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Type d'opération</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFilter("type", "all")}
                    className={`flex-1 py-2 text-sm rounded-lg border ${currentType === "all" ? "bg-accent/20 border-blue-600 text-accent" : "bg-surface-hover border-border text-muted"}`}
                  >Tous</button>
                  <button
                    onClick={() => updateFilter("type", "income")}
                    className={`flex-1 py-2 text-sm rounded-lg border ${currentType === "income" ? "bg-emerald-600/20 border-emerald-600 text-success" : "bg-surface-hover border-border text-muted"}`}
                  >Recettes</button>
                  <button
                    onClick={() => updateFilter("type", "expense")}
                    className={`flex-1 py-2 text-sm rounded-lg border ${currentType === "expense" ? "bg-red-600/20 border-red-600 text-danger" : "bg-surface-hover border-border text-muted"}`}
                  >Dépenses</button>
                </div>
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Catégorie</label>
                <select
                  value={currentCategoryId}
                  onChange={(e) => updateFilter("categoryId", e.target.value)}
                  className="w-full bg-surface-hover border border-border rounded-xl px-4 py-3 text-sm text-primary-text focus:border-accent outline-none"
                >
                  <option value="all">Toutes les catégories</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Statut de paiement */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Statut de paiement</label>
                <select
                  value={currentPaymentStatus}
                  onChange={(e) => updateFilter("paymentStatus", e.target.value)}
                  className="w-full bg-surface-hover border border-border rounded-xl px-4 py-3 text-sm text-primary-text focus:border-accent outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="paid">Payé totalement</option>
                  <option value="partial">Paiement partiel</option>
                  <option value="unpaid">Non payé (À crédit)</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-border flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 bg-surface-hover hover:bg-gray-700 text-primary-text rounded-xl text-sm font-medium transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-accent hover:bg-accent-hover text-primary-text rounded-xl text-sm font-medium transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
