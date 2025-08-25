// utils/routeExport.ts
import type { Stop } from "../types/PlannerTypes";

// If Stop doesn't already have placeId, uncomment this:
// type ExtendedStop = Stop & { placeId?: string };

export function buildGoogleMapsUrl(stops: Stop[]): string {
  if (!stops || stops.length < 2) return "";
  const origin = `${stops[0].lat},${stops[0].lng}`;
  const destination = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
  const waypoints = stops
    .slice(1, -1)
    .slice(0, 23)
    .map((s) => `${s.lat},${s.lng}`)
    .join("|");

  const base = "https://www.google.com/maps/dir/?api=1";
  const params = new URLSearchParams({ origin, destination, travelmode: "driving" });
  if (waypoints) params.set("waypoints", waypoints);
  return `${base}&${params.toString()}`;
}

export function makeGpx(stops: Stop[]): string {
  const nowIso = new Date().toISOString();
  const trkpts = stops
    .map(
      (s) =>
        `      <trkpt lat="${s.lat}" lon="${s.lng}"><name>${escapeXml(
          s.name ?? `${s.lat},${s.lng}`
        )}</name></trkpt>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="DGRoutePlanner" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>DGRoutePlanner Trip</name><time>${nowIso}</time></metadata>
  <trk><name>Disc Golf Trip</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;
}

export function exportJson(
  stops: Stop[],
  meta: { totalKm: number; totalHours: number }
): string {
  return JSON.stringify(
    {
      name: "DGRoutePlanner Trip",
      createdAt: new Date().toISOString(),
      totalKm: meta.totalKm,
      totalHours: meta.totalHours,
      stops: stops.map((s) => ({
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        // if placeId exists on Stop it will be included, otherwise undefined
        placeId: "placeId" in s ? (s as Stop & { placeId?: string }).placeId : undefined,
      })),
    },
    null,
    2
  );
}

export function download(
  filename: string,
  data: string | Blob,
  mime = "application/octet-stream"
): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
