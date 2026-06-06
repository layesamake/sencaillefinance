import Link from "next/link";
import { Wallet, ChevronRight, Users } from "lucide-react";
import LogoutButton from "@/components/settings/LogoutButton";

export default function SettingsPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration de l'application</p>
      </div>

      <div className="space-y-3">
        <Link href="/settings/accounts" className="block">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center justify-between hover:bg-gray-800/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-100">Comptes financiers</h3>
                <p className="text-sm text-gray-500">Ajouter ou modifier vos caisses et banques</p>
              </div>
            </div>
            <ChevronRight className="text-gray-600" />
          </div>
        </Link>

        <Link href="/settings/users" className="block">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center justify-between hover:bg-gray-800/80 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-100">Gestion des utilisateurs</h3>
                <p className="text-sm text-gray-500">Gérer les accès et rôles (Admin/User)</p>
              </div>
            </div>
            <ChevronRight className="text-gray-600" />
          </div>
        </Link>

        <LogoutButton />
      </div>
    </div>
  );
}
