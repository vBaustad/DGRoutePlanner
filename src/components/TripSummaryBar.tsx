// components/TripSummaryBar.tsx
export function TripSummaryBar({ className = "" }: { className?: string }) {
  const totalKm = 0;   // wire from planner/route
  const totalH = 0;

  return (
    <div className={`rounded-lg border border-base-300 bg-white shadow-sm p-3 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
        <div className="flex items-center gap-4">
          <span>🧭 {totalKm} km</span>
          <span>⏱️ {totalH} h</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-outline">Share</button>
          <button className="btn btn-sm btn-outline">Export</button>
          <button className="btn btn-sm btn-primary">Start</button>
        </div>
      </div>
    </div>
  );
}
