"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, History, CreditCard, BarChart2 } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Accueil", href: "/dashboard", icon: Home },
    { name: "Saisir", href: "/operations/new", icon: PlusCircle },
    { name: "Historique", href: "/operations", icon: History },
    { name: "Crédits", href: "/credits", icon: CreditCard },
    { name: "Rapports", href: "/reports", icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border pb-safe z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Match exactly, or handle child routes.
          // For /operations and /operations/new we need exact matching logic.
          const isActive = pathname === item.href || (item.href !== "/operations" && pathname.startsWith(item.href) && item.href !== "/dashboard");
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-accent" : "text-muted hover:text-primary-text"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
