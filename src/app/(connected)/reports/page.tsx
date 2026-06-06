import { getReportsData } from "@/lib/queries/reports";
import ReportsDashboard from "@/components/reports/ReportsDashboard";

export default async function ReportsPage() {
  const data = await getReportsData();

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Rapports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Analysez vos performances financières
        </p>
      </div>

      {data ? (
        <ReportsDashboard data={data} />
      ) : (
        <p className="text-red-400">Erreur de chargement des données.</p>
      )}
    </div>
  );
}
