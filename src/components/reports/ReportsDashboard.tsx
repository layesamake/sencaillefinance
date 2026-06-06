"use client";

import { useState } from "react";

interface ReportsData {
  monthlyData: { monthStr: string, income: number, expense: number }[];
  categoryExpenses: { name: string, amount: number, color: string }[];
  categoryIncomes: { name: string, amount: number, color: string }[];
}

export default function ReportsDashboard({ data }: { data: ReportsData }) {
  const [tab, setTab] = useState<"evolution" | "expenses" | "incomes">("evolution");

  // max value for monthly chart scaling
  const maxMonthly = Math.max(
    ...data.monthlyData.map(m => Math.max(m.income, m.expense)),
    1 // prevent division by zero
  );

  const totalExpense = data.categoryExpenses.reduce((s, c) => s + c.amount, 0) || 1;
  const totalIncome = data.categoryIncomes.reduce((s, c) => s + c.amount, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-surface rounded-2xl p-1 border border-border">
        <button
          onClick={() => setTab("evolution")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "evolution" ? "bg-surface-hover text-accent shadow-md" : "text-muted hover:text-primary-text"
          }`}
        >
          Évolution
        </button>
        <button
          onClick={() => setTab("expenses")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "expenses" ? "bg-surface-hover text-danger shadow-md" : "text-muted hover:text-primary-text"
          }`}
        >
          Dépenses
        </button>
        <button
          onClick={() => setTab("incomes")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "incomes" ? "bg-surface-hover text-success shadow-md" : "text-muted hover:text-primary-text"
          }`}
        >
          Revenus
        </button>
      </div>

      {tab === "evolution" && (
        <div className="bg-surface border border-border rounded-3xl p-6">
          <h2 className="text-lg font-bold text-primary-text mb-6">Évolution sur 6 mois</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyData.map((m, i) => {
              const hInc = (m.income / maxMonthly) * 100;
              const hExp = (m.expense / maxMonthly) * 100;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full h-full flex items-end justify-center gap-1 relative">
                    <div 
                      className="w-1/2 max-w-[12px] bg-success rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${hInc}%`, minHeight: m.income > 0 ? '4px' : '0' }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-hover text-success text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none transition-opacity z-10">
                        {m.income.toLocaleString("fr-FR")} F
                      </div>
                    </div>
                    <div 
                      className="w-1/2 max-w-[12px] bg-danger rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${hExp}%`, minHeight: m.expense > 0 ? '4px' : '0' }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface-hover text-danger text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none transition-opacity z-10">
                        {m.expense.toLocaleString("fr-FR")} F
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted uppercase font-semibold">{m.monthStr}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-border text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-success rounded-full"></div><span className="text-muted">Revenus</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-danger rounded-full"></div><span className="text-muted">Dépenses</span></div>
          </div>
        </div>
      )}

      {tab === "expenses" && (
        <CategoryBars title="Répartition des Dépenses (6 derniers mois)" data={data.categoryExpenses} total={totalExpense} colorType="text-danger" />
      )}

      {tab === "incomes" && (
        <CategoryBars title="Répartition des Revenus (6 derniers mois)" data={data.categoryIncomes} total={totalIncome} colorType="text-success" />
      )}
    </div>
  );
}

function CategoryBars({ title, data, total, colorType }: { title: string, data: any[], total: number, colorType: string }) {
  if (data.length === 0) return (
    <div className="bg-surface border border-border rounded-3xl p-6 text-center text-muted py-12">
      Aucune donnée disponible.
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-3xl p-6">
      <h2 className="text-lg font-bold text-primary-text mb-6">{title}</h2>
      <div className="space-y-5">
        {data.map((cat, i) => {
          const percent = (cat.amount / total) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-primary-text">{cat.name}</span>
                <div className="text-right">
                  <span className={`font-bold ${colorType}`}>{cat.amount.toLocaleString("fr-FR")} F</span>
                  <span className="text-xs text-muted ml-2">({percent.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${percent}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
