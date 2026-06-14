"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from "lucide-react";

export default function SmartFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const actions = [
    { name: "Nouveau Transfert", href: "/operations/new?tab=transfer", icon: ArrowRightLeft, color: "text-accent", bgColor: "bg-accent/10", borderColor: "border-accent/30" },
    { name: "Nouvelle Dépense", href: "/operations/new?type=expense", icon: ArrowUpRight, color: "text-danger", bgColor: "bg-danger/10", borderColor: "border-danger/30" },
    { name: "Nouvelle Recette", href: "/operations/new?type=income", icon: ArrowDownRight, color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/30" },
  ];

  return (
    <>
      {/* Backdrop to dim the screen when open */}
      <div 
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end" ref={menuRef}>
        {/* Speed Dial Menu */}
        <div 
          className={`flex flex-col gap-3 mb-4 transition-all duration-300 origin-bottom ${
            isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 translate-y-10 pointer-events-none"
          }`}
        >
          {actions.map((action, index) => {
            const Icon = action.icon;
            // Calcule un délai pour un effet d'apparition en cascade (waterfall reveal)
            const delay = isOpen ? `${(actions.length - index) * 50}ms` : '0ms';

            return (
              <Link 
                key={action.name}
                href={action.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 group justify-end"
                style={{ transitionDelay: delay }}
              >
                <span className={`bg-surface border border-border px-3 py-2 rounded-xl text-xs font-bold text-primary-text shadow-lg transition-all duration-300 origin-right ${
                  isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 translate-x-4"
                }`}
                style={{ transitionDelay: delay }}>
                  {action.name}
                </span>
                <div className={`p-3.5 rounded-2xl border ${action.bgColor} ${action.borderColor} ${action.color} shadow-lg transition-transform hover:scale-110 active:scale-95`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-primary-text p-4 rounded-2xl shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105 relative ${
            isOpen ? "bg-surface border-2 border-accent text-accent" : "bg-accent shadow-blue-900/30"
          }`}
          aria-label="Nouvelles actions"
        >
          <Plus 
            size={28} 
            strokeWidth={3} 
            className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`} 
          />
        </button>
      </div>
    </>
  );
}
