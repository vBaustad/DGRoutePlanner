// components/TripSummaryBar.tsx
import { useState } from "react";
import { useTripSummary } from "../hooks/useTripSummary";
import type { Stop } from "../types/PlannerTypes";
import { buildGoogleMapsUrl, makeGpx, exportJson, download } from "../utils/routeExport";

type NavigatorWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };

export function TripSummaryBar({
  className = "",
  onStartOver, // <- wire this from your parent or context
}: {
  className?: string;
  onStartOver?: () => void;
}) {
  const { route, totalKm, totalHours } = useTripSummary();
  const [copied, setCopied] = useState(false);

  const mapsUrl = route.length >= 2 ? buildGoogleMapsUrl(route as Stop[]) : "";
  const fmt1 = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });

  // unified share/export actions
  const doCopyLink = async () => {
    if (!mapsUrl) return;
    try {
      await navigator.clipboard.writeText(mapsUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // eslint-disable-next-line no-alert
      window.prompt("Copy your Google Maps link:", mapsUrl);
    }
  };

  const doNativeShare = async () => {
    if (!mapsUrl) return;
    if ("share" in navigator) {
      try {
        await (navigator as NavigatorWithShare).share?.({
          title: "DGRoutePlanner Trip",
          text: "Check out my disc golf road trip!",
          url: mapsUrl,
        });
        return;
      } catch {
        /* user cancelled; fall through to copy */
      }
    }
    await doCopyLink();
  };

  const exportGPX = () =>
    route.length && download("dgrouteplanner-trip.gpx", makeGpx(route as Stop[]), "application/gpx+xml");

  const exportJSON = () =>
    route.length &&
    download(
      "dgrouteplanner-trip.json",
      exportJson(route as Stop[], { totalKm, totalHours }),
      "application/json"
    );

  const startInMaps = () => {
    if (mapsUrl) window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`relative overflow-visible rounded-lg border border-base-300 bg-white shadow-sm p-3 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
        <div className="flex items-center gap-4">
          <span title="Total distance">🧭 {fmt1(totalKm)} km</span>
          <span title="Estimated drive time">⏱️ {fmt1(totalHours)} h</span>
          <span title="Stops count">📍 {route.length}</span>
        </div>

        <div className="flex items-center gap-2">          
          {onStartOver && (
            <button className="btn btn-sm btn-outline" onClick={onStartOver}>
              Start Over
            </button>
          )}
          {/* One dropdown that contains Share + Export options */}
          <div className="dropdown dropdown-end dropdown-top">
            <button className="btn btn-sm btn-outline" tabIndex={0} disabled={!route.length}>
              Share
            </button>
            <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-56">
              <li>
                <button onClick={doNativeShare} disabled={!route.length}>
                  Share link (native)
                </button>
              </li>
              <li>
                <button onClick={doCopyLink} disabled={!route.length}>
                  {copied ? "Copied!" : "Copy Google Maps link"}
                </button>
              </li>
              <li>
                <button onClick={exportGPX} disabled={!route.length}>
                  Export GPX
                </button>
              </li>
              <li>
                <button onClick={exportJSON} disabled={!route.length}>
                  Export JSON
                </button>
              </li>
            </ul>
          </div>
          <button className="btn btn-sm btn-primary" onClick={startInMaps} disabled={!route.length}>
            Start
          </button>
        </div>
      </div>

      {route.length > 25 && (
        <div className="mt-2 text-xs opacity-70">
          Google Maps supports up to 25 total points (origin + destination + 23 waypoints). The Maps
          link will be truncated.
        </div>
      )}
    </div>
  );
}
