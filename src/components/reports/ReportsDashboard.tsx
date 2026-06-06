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
      <div className="flex bg-gray-900 rounded-2xl p-1 border border-gray-800">
        <button
          onClick={() => setTab("evolution")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "evolution" ? "bg-gray-800 text-blue-400 shadow-md" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Évolution
        </button>
        <button
          onClick={() => setTab("expenses")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "expenses" ? "bg-gray-800 text-red-400 shadow-md" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Dépenses
        </button>
        <button
          onClick={() => setTab("incomes")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "incomes" ? "bg-gray-800 text-emerald-400 shadow-md" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Revenus
        </button>
      </div>

      {tab === "evolution" && (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-6">Évolution sur 6 mois</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyData.map((m, i) => {
              const hInc = (m.income / maxMonthly) * 100;
              const hExp = (m.expense / maxMonthly) * 100;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full h-full flex items-end justify-center gap-1 relative">
                    <div 
                      className="w-1/2 max-w-[12px] bg-emerald-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${hInc}%`, minHeight: m.income > 0 ? '4px' : '0' }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-emerald-400 text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none transition-opacity z-10">
                        {m.income.toLocaleString("fr-FR")} F
                      </div>
                    </div>
                    <div 
                      className="w-1/2 max-w-[12px] bg-red-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${hExp}%`, minHeight: m.expense > 0 ? '4px' : '0' }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-red-400 text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none transition-opacity z-10">
                        {m.expense.toLocaleString("fr-FR")} F
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">{m.monthStr}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-800 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-gray-400">Revenus</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-gray-400">Dépenses</span></div>
          </div>
        </div>
      )}

      {tab === "expenses" && (
        <CategoryBars title="Répartition des Dépenses (6 derniers mois)" data={data.categoryExpenses} total={totalExpense} colorType="text-red-400" />
      )}

      {tab === "incomes" && (
        <CategoryBars title="Répartition des Revenus (6 derniers mois)" data={data.categoryIncomes} total={totalIncome} colorType="text-emerald-400" />
      )}
    </div>
  );
}

function CategoryBars({ title, data, total, colorType }: { title: string, data: any[], total: number, colorType: string }) {
  if (data.length === 0) return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-center text-gray-500 py-12">
      Aucune donnée disponible.
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
      <h2 className="text-lg font-bold text-gray-100 mb-6">{title}</h2>
      <div className="space-y-5">
        {data.map((cat, i) => {
          const percent = (cat.amount / total) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-gray-300">{cat.name}</span>
                <div className="text-right">
                  <span className={`font-bold ${colorType}`}>{cat.amount.toLocaleString("fr-FR")} F</span>
                  <span className="text-xs text-gray-500 ml-2">({percent.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
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
