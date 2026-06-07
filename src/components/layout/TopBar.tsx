"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut, Settings, Users, Grid, Landmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface TopBarProps {
  role: string | null;
  fullName: string | null;
}

export default function TopBar({ role, fullName }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const adminMenuItems = [
    { name: "Catégories", href: "/categories", icon: Grid },
    { name: "Utilisateurs", href: "/settings/users", icon: Users },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border h-16 z-50 px-4 flex items-center justify-between transition-colors duration-300">
        <Link href="/dashboard" className="flex items-center space-x-2 text-xl font-bold text-primary-text tracking-tight">
          <Landmark size={24} className="text-accent" />
          <span>SENCAILLE FINANCE</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-muted hover:text-primary-text focus:outline-none transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Menu Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 max-w-md mx-auto bg-background/95 backdrop-blur-sm flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <span className="text-sm font-medium text-muted">
              {fullName || "Utilisateur"} <span className="text-accent ml-1">({role || "user"})</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-muted hover:text-primary-text focus:outline-none transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
              Menu Principal
            </div>
            <Link
              href="/parties"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-muted hover:bg-surface-hover hover:text-primary-text transition-colors"
            >
              <Users size={20} />
              <span className="font-medium">Tiers (Clients/Fourn.)</span>
            </Link>
            
            <div className="h-px bg-border my-4"></div>
            {role === "admin" && (
              <>
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-4 px-2">
                  Administration
                </div>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg text-muted hover:bg-surface-hover hover:text-primary-text transition-colors"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                <div className="h-px bg-border my-4"></div>
              </>
            )}

            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
              Compte
            </div>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-muted hover:bg-surface-hover hover:text-primary-text transition-colors"
            >
              <User size={20} />
              <span className="font-medium">Profil</span>
            </Link>
            
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-danger hover:bg-danger/10 transition-colors mt-2"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
