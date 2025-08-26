// components/TripSummaryBar.tsx
import { useState } from "react";
import { useTripSummary } from "../hooks/useTripSummary";
import type { Stop } from "../types/PlannerTypes";
import { buildGoogleMapsUrl, makeGpx, exportJson, download } from "../utils/routeExport";

type NavigatorWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };

export function TripSummaryBar({
  className = "",
  onStartOver,
}: {
  className?: string;
  onStartOver?: () => void;
}) {
  const { route, totalKm, totalHours } = useTripSummary();
  const [copied, setCopied] = useState(false);

  const mapsUrl = route.length >= 2 ? buildGoogleMapsUrl(route as Stop[]) : "";
  const fmt1 = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const doCopyLink = async () => {
    if (!mapsUrl) return;
    try {
      await navigator.clipboard.writeText(mapsUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
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
        /* user cancelled */
      }
    }
    await doCopyLink();
  };

  const exportGPX = () =>
    route.length && download("dgrouteplanner-trip.gpx", makeGpx(route as Stop[]), "application/gpx+xml");

  const exportJSON = () =>
    route.length &&
    download("dgrouteplanner-trip.json", exportJson(route as Stop[], { totalKm, totalHours }), "application/json");

  const startInMaps = () => {
    if (mapsUrl) window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`
        w-full min-w-0
        rounded-lg border border-[#626F47]/20 bg-[#F9FAF5] shadow-sm
        p-3 sm:p-4
        relative overflow-visible
        ${className}
      `}
    >
      <div
        className="
          flex flex-col gap-3
          sm:flex-row sm:flex-wrap sm:items-center sm:justify-between
          text-sm
        "
      >
        {/* Metrics */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 min-w-0">
          <span className="shrink-0" title="Total distance">🧭 {fmt1(totalKm)} km</span>
          <span className="shrink-0" title="Estimated drive time">⏱️ {fmt1(totalHours)} h</span>
          <span className="shrink-0" title="Stops count">📍 {route.length}</span>
        </div>

        {/* Actions */}
        <div
          className="
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            gap-2 sm:gap-2
          "
        >
          {onStartOver && (
            <button
              className="btn btn-sm border-[#626F47]/30 text-[#3E462C] hover:bg-[#626F47]/10"
              onClick={onStartOver}
            >
              Start Over
            </button>
          )}

          {/* Share / Export dropdown */}
          <div className="dropdown dropdown-end dropdown-top">
            <button
              className="btn btn-sm border-[#626F47]/30 text-[#3E462C] hover:bg-[#626F47]/10 disabled:opacity-50"
              tabIndex={0}
              disabled={!route.length}
            >
              Share / Export
            </button>
            <ul className="dropdown-content z-50 menu p-2 shadow bg-white rounded-box w-56 border border-[#626F47]/15">
              <li>
                <button onClick={doNativeShare} disabled={!route.length}>Share link (native)</button>
              </li>
              <li>
                <button onClick={doCopyLink} disabled={!route.length}>
                  {copied ? "Copied!" : "Copy Google Maps link"}
                </button>
              </li>
              <li><button onClick={exportGPX} disabled={!route.length}>Export GPX</button></li>
              <li><button onClick={exportJSON} disabled={!route.length}>Export JSON</button></li>
            </ul>
          </div>

          <button
            className="btn btn-sm bg-[#626F47] hover:bg-[#4E5839] text-white disabled:opacity-50"
            onClick={startInMaps}
            disabled={!route.length}
          >
            Start
          </button>
        </div>
      </div>

      {route.length > 25 && (
        <div className="mt-2 text-xs text-gray-600">
          Google Maps supports up to 25 total points (origin + destination + 23 waypoints). The Maps link will be truncated.
        </div>
      )}
    </div>
  );
}
