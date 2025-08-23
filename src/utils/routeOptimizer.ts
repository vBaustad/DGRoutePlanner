// utils/routeOptimizer.ts
import type { DiscGolfCourse } from "../types/PlannerTypes";

type LatLng = { lat: number; lng: number };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const aa =
    s1 * s1 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      s2 * s2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

async function distanceMatrixChunk(
  origin: LatLng,
  chunk: DiscGolfCourse[]
): Promise<number[]> {
  const service = new google.maps.DistanceMatrixService();
  const resp = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(origin.lat, origin.lng)],
        destinations: chunk.map((c) => new google.maps.LatLng(c.lat, c.lng)),
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (result, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && result) resolve(result);
        else reject(new Error(`DistanceMatrix ${status}`));
      }
    );
  });

  const row = resp.rows[0];
  return row.elements.map((e) =>
    e.status === "OK"
      ? e.duration?.value ?? e.distance?.value ?? Number.POSITIVE_INFINITY
      : Number.POSITIVE_INFINITY
  );
}

export async function findClosestCourseByRoad(
  origin: LatLng,
  candidates: DiscGolfCourse[]
): Promise<{ closest: DiscGolfCourse; remaining: DiscGolfCourse[] }> {
  const batchSize = 25;
  const durations: number[] = new Array(candidates.length).fill(Number.POSITIVE_INFINITY);
  let idx = 0;
  let usedFallback = false;

  for (let i = 0; i < candidates.length; i += batchSize) {
    const chunk = candidates.slice(i, i + batchSize);
    let ok = false;
    let attempt = 0;
    while (!ok && attempt <= 2) {
      try {
        const vals = await distanceMatrixChunk(origin, chunk);
        for (let j = 0; j < vals.length; j++) durations[i + j] = vals[j];
        ok = true;
      } catch {
        attempt += 1;
        if (attempt > 2) {
          usedFallback = true;
          for (let j = 0; j < chunk.length; j++) {
            durations[i + j] = haversineMeters(origin, chunk[j]);
          }
        } else {
          await sleep(300 * attempt);
        }
      }
    }
  }

  let best = Number.POSITIVE_INFINITY;
  let bestIdx = -1;
  for (idx = 0; idx < candidates.length; idx++) {
    const d = durations[idx];
    if (d < best) {
      best = d;
      bestIdx = idx;
    }
  }

  if (bestIdx < 0) throw new Error("No valid distances for candidates");

  const closest = candidates[bestIdx];
  const remaining = candidates.filter((_, i) => i !== bestIdx);

  console.log("[findClosestCourseByRoad]", {
    candidates: candidates.length,
    usedFallback,
    bestSecondsOrMeters: best,
    closest: closest.name,
  });

  return { closest, remaining };
}

export async function orderCoursesByDrivingDistance(
  start: LatLng,
  courses: DiscGolfCourse[]
): Promise<DiscGolfCourse[]> {
  let current = start;
  let remaining = [...courses];
  const ordered: DiscGolfCourse[] = [];
  let steps = 0;

  while (remaining.length > 0) {
    const { closest, remaining: next } = await findClosestCourseByRoad(current, remaining);
    ordered.push(closest);
    current = { lat: closest.lat, lng: closest.lng };
    remaining = next;
    steps += 1;
  }

  console.log("[orderCoursesByDrivingDistance]", {
    input: courses.length,
    output: ordered.length,
    steps,
  });

  return ordered;
}
