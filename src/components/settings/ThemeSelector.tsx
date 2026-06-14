"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const themes = [
  { id: "light", name: "Clair", color: "#ffffff", border: "#e5e5e5" },
  { id: "dark", name: "Sombre", color: "#18181b", border: "#3f3f46" },
  { id: "nature", name: "Nature", color: "#1c251c", border: "#10b981" },
  { id: "ocean", name: "Océan", color: "#164e63", border: "#06b6d4" },
  { id: "royal", name: "Royal", color: "#4c1d95", border: "#8b5cf6" },
  { id: "sunset", name: "Crépuscule", color: "#78350f", border: "#f97316" },
];

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Évite les erreurs d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-32 bg-surface animate-pulse rounded-2xl" />;
  }

  return (
    <div className="bg-surface border border-border p-5 rounded-2xl">
      <h3 className="font-bold text-primary-text mb-4">Personnalisation du thème</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {themes.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isActive ? "ring-2 ring-offset-2 ring-offset-background ring-accent scale-110" : "hover:scale-105"
                }`}
                style={{ backgroundColor: t.color, border: `2px solid ${t.border}` }}
              >
                {isActive && <Check size={20} className="text-white drop-shadow-md" />}
              </div>
              <span className={`text-xs font-medium transition-colors ${isActive ? "text-accent" : "text-muted group-hover:text-primary-text"}`}>
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
