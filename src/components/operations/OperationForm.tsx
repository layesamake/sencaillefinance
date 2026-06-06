"use client";

import { useState, useTransition, useMemo } from "react";
import type { Category, Account, Party, OperationType, SettlementMode } from "@/types/database";
import { submitOperationAction } from "@/app/(connected)/operations/actions";
import QuickCategoryModal from "@/components/categories/QuickCategoryModal";
import QuickPartyModal from "@/components/parties/QuickPartyModal";

interface OperationFormProps {
  categories: Category[];
  accounts: Account[];
  parties: Party[];
}

export default function OperationForm({ categories: initialCategories, accounts, parties: initialParties }: OperationFormProps) {
  // State from props that can be extended via quick creation
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [parties, setParties] = useState<Party[]>(initialParties);

  // Form State
  const [operationType, setOperationType] = useState<OperationType>("income");
  const [categoryId, setCategoryId] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [settlementMode, setSettlementMode] = useState<SettlementMode>("paid");
  const [initialAccountId, setInitialAccountId] = useState<string>("");
  const [initialPaidAmount, setInitialPaidAmount] = useState<string>("");
  const [partyId, setPartyId] = useState<string>("");
  const [operationDate, setOperationDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPartyModal, setShowPartyModal] = useState(false);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Computed
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => c.operation_type === operationType);
  }, [categories, operationType]);

  const requiredPartyType = operationType === "income" ? "customer" : "supplier";
  
  const filteredParties = useMemo(() => {
    return parties.filter((p) => p.party_type === requiredPartyType || p.party_type === "both");
  }, [parties, requiredPartyType]);

  // Handle Type Change
  const handleTypeChange = (type: OperationType) => {
    setOperationType(type);
    setCategoryId("");
    setPartyId("");
  };

  // Handle Settlement Mode Change
  const handleModeChange = (mode: SettlementMode) => {
    setSettlementMode(mode);
    if (mode === "credit") {
      setInitialPaidAmount("0");
      setInitialAccountId("");
    } else if (mode === "paid") {
      setInitialPaidAmount(totalAmount);
    } else {
      setInitialPaidAmount("");
    }
  };

  // Keep paid amount in sync if mode is "paid"
  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTotalAmount(val);
    if (settlementMode === "paid") {
      setInitialPaidAmount(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("operation_type", operationType);
      formData.set("category_id", categoryId);
      formData.set("total_amount", totalAmount);
      formData.set("settlement_mode", settlementMode);
      formData.set("initial_paid_amount", settlementMode === "paid" ? totalAmount : initialPaidAmount);
      if (initialAccountId) formData.set("initial_account_id", initialAccountId);
      if (partyId) formData.set("party_id", partyId);
      formData.set("operation_date", operationDate);
      if (description) formData.set("description", description);

      const result = await submitOperationAction(formData);

      if (result.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Succès - pour l'instant on redirige ou on affiche un message.
        // La Server Action a déjà appelé revalidatePath.
        // On pourrait reset le form ici.
        setTotalAmount("");
        setInitialPaidAmount("");
        setDescription("");
        alert("Opération enregistrée avec succès !");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-950/50 border border-red-900/50 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type d'opération */}
        <div className="bg-surface rounded-2xl p-5 border border-border space-y-4">
          <label className="block text-sm font-medium text-primary-text">Type d'opération</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex-1 rounded-xl py-3.5 text-sm font-medium border transition-all ${
                operationType === "income"
                  ? "bg-emerald-600/20 border-emerald-600 text-success shadow-[0_0_15px_rgba(5,150,105,0.1)]"
                  : "bg-surface-hover border-border text-muted hover:border-gray-600"
              }`}
            >
              Recette
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex-1 rounded-xl py-3.5 text-sm font-medium border transition-all ${
                operationType === "expense"
                  ? "bg-red-600/20 border-red-600 text-danger shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                  : "bg-surface-hover border-border text-muted hover:border-gray-600"
              }`}
            >
              Dépense
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-border space-y-5">
          {/* Catégorie */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Catégorie</label>
            <div className="flex gap-2">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex-1 rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
              >
                <option value="">Sélectionner une catégorie...</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="rounded-xl bg-surface-hover border border-border px-4 text-muted hover:text-primary-text hover:border-gray-500 transition-colors"
                title="Nouvelle catégorie"
              >
                +
              </button>
            </div>
          </div>

          {/* Montant Total */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">Montant total (FCFA)</label>
            <input
              type="number"
              min="1"
              value={totalAmount}
              onChange={handleTotalAmountChange}
              placeholder="Ex: 50000"
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-lg font-semibold text-primary-text placeholder:text-gray-600 placeholder:font-normal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-border space-y-5">
          {/* Mode de règlement */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-text">Règlement</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleModeChange("paid")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                  settlementMode === "paid"
                    ? "bg-accent/20 border-blue-600 text-accent"
                    : "bg-surface-hover border-border text-muted"
                }`}
              >
                Payé totalement
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("partial")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                  settlementMode === "partial"
                    ? "bg-amber-600/20 border-amber-600 text-warning"
                    : "bg-surface-hover border-border text-muted"
                }`}
              >
                Paiement partiel
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("credit")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                  settlementMode === "credit"
                    ? "bg-purple-600/20 border-purple-600 text-purple-400"
                    : "bg-surface-hover border-border text-muted"
                }`}
              >
                À crédit
              </button>
            </div>
          </div>

          {/* Détails Paiement (si pas à crédit total) */}
          {settlementMode !== "credit" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-primary-text">
                  {settlementMode === "paid" ? "Moyen de paiement" : "Moyen (Avance)"}
                </label>
                <select
                  value={initialAccountId}
                  onChange={(e) => setInitialAccountId(e.target.value)}
                  className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent appearance-none"
                >
                  <option value="">Choisir un compte...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              {settlementMode === "partial" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-primary-text">Montant payé (FCFA)</label>
                  <input
                    type="number"
                    min="1"
                    max={totalAmount ? parseInt(totalAmount) - 1 : undefined}
                    value={initialPaidAmount}
                    onChange={(e) => setInitialPaidAmount(e.target.value)}
                    placeholder="Ex: 20000"
                    className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm font-medium text-warning focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Tiers & Date */}
        <div className="bg-surface rounded-2xl p-5 border border-border space-y-5">
          {/* Client / Fournisseur */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">
              {operationType === "income" ? "Client" : "Fournisseur"}
              {settlementMode === "paid" && <span className="text-muted font-normal ml-1">(Facultatif)</span>}
              {settlementMode !== "paid" && <span className="text-danger ml-1">*</span>}
            </label>
            <div className="flex gap-2">
              <select
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                className="flex-1 rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent appearance-none"
              >
                <option value="">Sélectionner...</option>
                {filteredParties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowPartyModal(true)}
                className="rounded-xl bg-surface-hover border border-border px-4 text-muted hover:text-primary-text hover:border-gray-500 transition-colors"
                title="Nouveau"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-primary-text">Date</label>
              <input
                type="date"
                value={operationDate}
                onChange={(e) => setOperationDate(e.target.value)}
                className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent appearance-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-primary-text">
              Description <span className="text-muted font-normal">(Facultatif)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Achat sacs aliment 50kg..."
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-primary-text focus:border-accent"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-accent hover:bg-accent-hover py-4 text-sm font-bold text-primary-text shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
        >
          {isPending ? "Enregistrement..." : "Enregistrer l'opération"}
        </button>
      </form>

      {/* Modals */}
      {showCategoryModal && (
        <QuickCategoryModal
          operationType={operationType}
          onClose={() => setShowCategoryModal(false)}
          onCreated={(cat) => {
            setCategories([...categories, cat]);
            setCategoryId(cat.id);
            setShowCategoryModal(false);
          }}
        />
      )}

      {showPartyModal && (
        <QuickPartyModal
          partyType={requiredPartyType}
          onClose={() => setShowPartyModal(false)}
          onCreated={(party) => {
            setParties([...parties, party]);
            setPartyId(party.id);
            setShowPartyModal(false);
          }}
        />
      )}
    </div>
  );
}
