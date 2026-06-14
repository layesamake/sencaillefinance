export default function DashboardLoading() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-surface border border-border rounded-lg"></div>
          <div className="h-4 w-64 bg-surface-hover border border-border rounded-lg"></div>
        </div>
        <div className="h-10 w-10 bg-surface border border-border rounded-xl"></div>
      </div>

      {/* Main Balance Card Skeleton */}
      <div className="h-32 bg-surface border border-border rounded-3xl"></div>

      {/* Accounts Skeleton */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="min-w-[140px] h-24 bg-surface border border-border rounded-2xl"></div>
        <div className="min-w-[140px] h-24 bg-surface border border-border rounded-2xl"></div>
        <div className="min-w-[140px] h-24 bg-surface border border-border rounded-2xl"></div>
      </div>

      {/* Debts/Receivables Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-28 bg-surface border border-border rounded-3xl"></div>
        <div className="h-28 bg-surface border border-border rounded-3xl"></div>
      </div>
      
      {/* Performance Skeleton */}
      <div className="h-32 bg-surface border border-border rounded-3xl"></div>

      {/* Recent Operations Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-surface border border-border rounded-lg mb-4"></div>
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-surface border border-border rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
