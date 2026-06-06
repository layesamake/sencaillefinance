import { getAllProfiles, getCurrentUserId } from "@/lib/queries/profiles";
import UsersList from "@/components/settings/UsersList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function UsersSettingsPage() {
  const [profiles, currentUserId] = await Promise.all([
    getAllProfiles(),
    getCurrentUserId()
  ]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="p-2 bg-surface border border-border rounded-xl text-muted hover:text-primary-text">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Utilisateurs</h1>
          <p className="text-sm text-muted mt-1">Gérez les accès et les rôles</p>
        </div>
      </div>

      <UsersList profiles={profiles} currentUserId={currentUserId} />
    </div>
  );
}
