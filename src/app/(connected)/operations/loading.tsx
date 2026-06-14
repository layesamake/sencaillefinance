export default function OperationsLoading() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-24 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-surface border border-border rounded-lg"></div>
          <div className="h-4 w-48 bg-surface-hover border border-border rounded-lg"></div>
        </div>
        <div className="h-10 w-24 bg-surface border border-border rounded-xl"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-2 overflow-x-hidden">
        <div className="h-10 w-24 bg-surface border border-border rounded-full shrink-0"></div>
        <div className="h-10 w-24 bg-surface border border-border rounded-full shrink-0"></div>
        <div className="h-10 w-24 bg-surface border border-border rounded-full shrink-0"></div>
      </div>

      {/* Summary Skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="h-20 bg-surface border border-border rounded-2xl"></div>
        <div className="h-20 bg-surface border border-border rounded-2xl"></div>
      </div>

      {/* List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-surface border border-border rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
