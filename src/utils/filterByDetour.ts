import type { DiscGolfCourse } from "../types/PlannerTypes";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const toRad = (x: number) => (x * Math.PI) / 180;
const havMeters = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const aa = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
};

// Find nearest polyline vertex to a course (sparse scan for speed)
export function nearestPathIndexForCourse(
  course: DiscGolfCourse,
  path: google.maps.LatLng[]
): number {
  if (!path.length) return 0;
  let bestI = 0;
  let bestD = Number.POSITIVE_INFINITY;
  const step = Math.max(1, Math.floor(path.length / 200)); // ~≤200 checks
  for (let i = 0; i < path.length; i += step) {
    const pt = path[i];
    const d = havMeters({ lat: course.lat, lng: course.lng }, { lat: pt.lat(), lng: pt.lng() });
    if (d < bestD) { bestD = d; bestI = i; }
  }
  return bestI;
}

/**
 * Keep courses whose **one-way** DRIVING time from the route (nearest polyline vertex)
 * is <= maxDetourMinutes. Uses 1-origin × K-destinations batching to avoid N² elements.
 * Robust fallback: if Distance Matrix fails or keeps none, use a haversine-based heuristic.
 */
export async function filterByDrivingDetour(
  courses: DiscGolfCourse[],
  path: google.maps.LatLng[],
  maxDetourMinutes: number,
  opts: { fallbackSpeedKmh?: number; throttleEvery?: number; throttleMs?: number } = {}
): Promise<DiscGolfCourse[]> {
  if (!courses.length || !path.length) return [];

  const { fallbackSpeedKmh = 60, throttleEvery = 8, throttleMs = 120 } = opts;

  // Group courses by nearest path vertex (origin)
  const groups = new Map<number, DiscGolfCourse[]>();
  for (const c of courses) {
    const idx = nearestPathIndexForCourse(c, path);
    if (!groups.has(idx)) groups.set(idx, []);
    groups.get(idx)!.push(c);
  }

  const svc = new google.maps.DistanceMatrixService();
  const keep = new Set<string>();

  const DEST_BATCH = 25;
  let batches = 0;
  let dmFailures = 0;

  for (const [idx, list] of groups.entries()) {
    const origin = path[Math.min(Math.max(idx, 0), path.length - 1)];

    for (let i = 0; i < list.length; i += DEST_BATCH) {
      const chunk = list.slice(i, i + DEST_BATCH);

      try {
        const res = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
          svc.getDistanceMatrix(
            {
              origins: [origin], // 1 origin (the route)
              destinations: chunk.map(c => new google.maps.LatLng(c.lat, c.lng)),
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
            },
            (r, status) => {
              if (status === google.maps.DistanceMatrixStatus.OK && r) resolve(r);
              else reject(new Error(`DistanceMatrix ${status}`));
            }
          );
        });

        const row = res.rows[0]; // single origin → K destinations
        for (let j = 0; j < chunk.length; j++) {
          const elem = row.elements[j];
          const sec = elem && elem.status === "OK" ? elem.duration?.value ?? null : null;
          const oneWayMin = sec ? sec / 60 : Number.POSITIVE_INFINITY;
          if (oneWayMin <= maxDetourMinutes) keep.add(chunk[j].place_id);
        }
      } catch {
        dmFailures += 1;
        // swallow and continue; we’ll fallback below if needed
      }

      batches++;
      if (batches % throttleEvery === 0) await sleep(throttleMs);
    }
  }

  let filtered = courses.filter(c => keep.has(c.place_id));

  // ----- Heuristic fallback if DM failed a lot or kept nothing -----
  if (filtered.length === 0) {
    const speedMps = (fallbackSpeedKmh * 1000) / 3600; // km/h → m/s
    const maxMeters = speedMps * (maxDetourMinutes * 60);

    filtered = courses.filter(c => {
      const idx = nearestPathIndexForCourse(c, path);
      const origin = path[idx];
      const meters = havMeters({ lat: c.lat, lng: c.lng }, { lat: origin.lat(), lng: origin.lng() });
      return meters <= maxMeters;
    });

    console.warn("[filterByDrivingDetour] Fallback heuristic used", {
      fallbackSpeedKmh,
      maxDetourMinutes,
      maxMeters: Math.round(maxMeters),
      kept: filtered.length,
      dmFailures,
    });
  } else {
    console.log("[filterByDrivingDetour] DM kept", {
      input: courses.length,
      groups: groups.size,
      kept: filtered.length,
      maxDetourMinutes,
      dmFailures,
    });
  }

  return filtered;
}
