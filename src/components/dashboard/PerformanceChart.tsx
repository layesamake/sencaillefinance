"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceChartProps {
  data: {
    date: string;
    timestamp: number;
    income: number;
    expense: number;
  }[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  // Optionnel: filtrer les jours qui n'ont ni entrée ni sortie pour rendre le graphe plus compact ?
  // Non, pour un histogramme de 30 jours, voir les jours vides montre bien l'inactivité.
  
  return (
    <div className="w-full h-72 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            tickLine={false}
            axisLine={false}
            minTickGap={20}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value === 0 ? '' : `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            cursor={{ fill: 'var(--surface-hover)' }}
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--border)',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ fontSize: 14, fontWeight: 'bold' }}
            formatter={(value: number) => [`${value.toLocaleString("fr-FR")} F`, ""]}
            labelStyle={{ color: 'var(--muted)', marginBottom: '8px', fontSize: 12 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: 'var(--muted)' }}
            iconType="circle"
          />
          <Bar 
            dataKey="income" 
            name="Entrées" 
            fill="var(--success)" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          />
          <Bar 
            dataKey="expense" 
            name="Sorties" 
            fill="var(--danger)" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
