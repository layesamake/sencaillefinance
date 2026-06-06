"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-surface-hover animate-pulse"></div>;
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("nature");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 text-muted hover:text-primary-text hover:bg-surface-hover rounded-full transition-colors flex items-center justify-center focus:outline-none"
      title={`Thème actuel: ${theme}`}
    >
      <Palette size={20} />
    </button>
  );
}
