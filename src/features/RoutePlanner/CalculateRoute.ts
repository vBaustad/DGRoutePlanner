// features/RoutePlanner/CalculateRoute.ts
import { fetchGeocode } from "../../utils/geocode";
import type { TripPlanForm } from "../../types/TripPlanForm";
import type { Stop, DiscGolfCourse } from "../../types/PlannerTypes";
import { fetchCoursesNearby } from "../../utils/fetchCoursesNearby";
import { deduplicateCourses } from "../../utils/deduplicateCourses";
import { filterByDrivingDetour } from "../../utils/filterByDetour";
import { orderByGoogleDirections } from "../../utils/orderByGoogleDirections";
import { courseToStop } from "../../utils/courseToStop";

export type PlannerMode = "full" | "suggestionsOnly";

export type PlannerResult = {
  stops: Stop[];
  totalDistance: number;  // meters
  totalDuration: number;  // seconds
  discoveredCourses: DiscGolfCourse[];
  topSuggestions: DiscGolfCourse[]; // score-ranked pool for replacements
};

export type RouteProgress =
  | { step: "init"; message: string; percent?: number }
  | { step: "geocode"; message: string; percent?: number }
  | { step: "directions"; message: string; percent?: number }
  | { step: "scanning"; message: string; percent?: number }
  | { step: "filtering"; message: string; percent?: number }
  | { step: "ranking"; message: string; percent?: number }
  | { step: "optimizing"; message: string; percent?: number }
  | { step: "finalize"; message: string; percent?: number };

export type PlannerArgs = {
  form: TripPlanForm;
  excludedPlaceIds?: Set<string>;
  mode?: PlannerMode;
  onProgress?: (p: RouteProgress) => void;
};

export function calculateRoute(form: TripPlanForm): Promise<PlannerResult>;
export function calculateRoute(args: PlannerArgs): Promise<PlannerResult>;

export async function calculateRoute(arg: TripPlanForm | PlannerArgs): Promise<PlannerResult> {
  // ---------- 0) Normalize args ----------
  function isTripPlanForm(x: unknown): x is TripPlanForm {
    return typeof x === "object" && x !== null && "startLocation" in x && "endLocation" in x;
  }
  const { form, excludedPlaceIds, mode, onProgress }: PlannerArgs = isTripPlanForm(arg)
    ? { form: arg, excludedPlaceIds: new Set<string>(), mode: "full" }
    : { form: arg.form, excludedPlaceIds: arg.excludedPlaceIds ?? new Set<string>(), mode: arg.mode ?? "full", onProgress: arg.onProgress };

  // tiny helper
  const ping = (p: RouteProgress) => { try { onProgress?.(p); } catch { /* ignore */ } };

  ping({ step: "init", message: "Warming up the chains…", percent: 0 });

  const {
    startLocation,
    endLocation,
    customStops = [],
    tripDays,
    coursesPerDay = 1,
    maxDetourMinutes = 30,
  } = form;

  const totalSuggestions = Math.max(1, tripDays * coursesPerDay);

  // ---------- 1) Directions: start → custom → end ----------
  ping({ step: "geocode", message: "Finding your tee and basket…", percent: 8 });

  const startCoords = await fetchGeocode(startLocation);
  const endCoords = await fetchGeocode(endLocation);
  if (!startCoords || !endCoords) throw new Error("Geocoding failed");

  const baseStops: Stop[] = [
    { name: startLocation, address: startLocation, ...startCoords, isCourse: false },
    ...customStops.map(s => ({
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      address: s.address,
      isCourse: !!s.isCourse,
      courseId: s.courseId,
    })),
    { name: endLocation, address: endLocation, ...endCoords, isCourse: false },
  ];

  ping({ step: "directions", message: "Plotting the fairway…", percent: 18 });

  const directionsService = new google.maps.DirectionsService();
  const directions = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
    directionsService.route(
      {
        origin: startCoords,
        destination: endCoords,
        waypoints: customStops.map(s => ({
          location: { lat: s.lat, lng: s.lng },
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) resolve(result);
        else reject(new Error("Directions API error: " + status));
      }
    );
  });

  const route0 = directions.routes[0];
  const legs = route0.legs;
  const totalDistance = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
  const totalDuration = legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0);

  // ---------- 2) Discover courses along the polyline ----------
  ping({ step: "scanning", message: "Scouting courses along your line…", percent: 30 });

  const path = route0.overview_path;
  const totalPoints = path.length;

  const numSamples = Math.max(totalSuggestions * 3, 24);
  const interval = Math.max(1, Math.floor(totalPoints / numSamples));

  // detour minutes → approx "road radius" in meters (clamped to Places 50km limit)
  const avgKmH = 70;
  const radiusMetersRaw = Math.floor((maxDetourMinutes / 60) * avgKmH * 1000);
  const radiusMeters = Math.max(8000, Math.min(radiusMetersRaw, 50000));

  const foundCourses: DiscGolfCourse[] = [];
  // a couple of progress ticks during scanning (not too chatty)
  const scanTicks = Math.max(1, Math.floor((totalPoints / interval) / 5)); // ~5 ticks max
  let tickCounter = 0;
  for (let i = 0; i < totalPoints; i += interval) {
    const p = path[i];
    const nearby = await fetchCoursesNearby(p.lat(), p.lng(), radiusMeters);
    foundCourses.push(...nearby);

    if (++tickCounter % scanTicks === 0) {
      const frac = Math.min(1, i / Math.max(1, totalPoints - 1));
      ping({
        step: "scanning",
        message: "Still scanning… found some tasty fairways 🍩",
        percent: Math.round(30 + frac * 15), // 30 → 45%
      });
    }
  }

  // Deduplicate & exclude
  let uniqueCourses = deduplicateCourses(foundCourses).filter(c => !excludedPlaceIds?.has(c.place_id));

  ping({ step: "filtering", message: "Checking detours (no wild goose chases)…", percent: 50 });

  // Keep only courses whose one‑way DRIVING time from the route ≤ maxDetourMinutes
  uniqueCourses = await filterByDrivingDetour(uniqueCourses, path, maxDetourMinutes);

  // Retry lightly if empty (denser scan + bigger radius, still ≤ 50k)
  if (uniqueCourses.length === 0) {
    ping({ step: "scanning", message: "Course desert detected—widening the search…", percent: 55 });

    const retrySamples = Math.max(numSamples * 2, 48);
    const retryInterval = Math.max(1, Math.floor(totalPoints / retrySamples));
    const retryRadius = Math.min(radiusMeters * 2, 50000);
    const retryFound: DiscGolfCourse[] = [];
    for (let i = 0; i < totalPoints; i += retryInterval) {
      const p = path[i];
      const nearby = await fetchCoursesNearby(p.lat(), p.lng(), retryRadius);
      retryFound.push(...nearby);
    }
    uniqueCourses = await filterByDrivingDetour(
      deduplicateCourses(retryFound).filter(c => !excludedPlaceIds?.has(c.place_id)),
      path,
      maxDetourMinutes
    );
  }

  if (uniqueCourses.length > 0 && import.meta.env.PROD) {
    // not a user‑visible step; no ping needed
    await fetch("/api/add-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uniqueCourses),
    });
  }

  // ---------- 3) Rank by popularity (reviews) + quality (rating) ----------
  ping({ step: "ranking", message: "Sorting by rating & rave reviews…", percent: 65 });

  function scoreCourse(c: DiscGolfCourse): number {
    const r = c.rating ?? 0;
    const n = c.reviews ?? 0;
    const quality = r / 5;                // 0..1
    const popularity = Math.log10(n + 1); // diminishing returns
    return quality * (1 + 1.6 * popularity);
  }

  const reliable = uniqueCourses.filter(c => (c.reviews ?? 0) >= 5 && (c.rating ?? 0) >= 4);
  const others   = uniqueCourses.filter(c => !reliable.includes(c));

  reliable.sort((a, b) => scoreCourse(b) - scoreCourse(a));
  others.sort((a, b) => scoreCourse(b) - scoreCourse(a));

  // pool = best candidates we can later use for replacements
  const poolSize = Math.max(totalSuggestions + tripDays * 3, 50);
  const pool: DiscGolfCourse[] = [...reliable, ...others].slice(0, poolSize);

  // pick the exact courses we’ll visit now
  const selected = pool.slice(0, Math.min(totalSuggestions, 23)); // Directions cap: 23 waypoints

  // ---------- 4) Suggestions-only early return ----------
  if (mode === "suggestionsOnly") {
    ping({ step: "finalize", message: "Suggestions locked. Ready when you are! 🥏", percent: 100 });
    return {
      stops: baseStops,
      totalDistance,
      totalDuration,
      discoveredCourses: uniqueCourses,
      topSuggestions: pool,
    };
  }

  // ---------- 5) Let Google Directions optimize the order ----------
  ping({ step: "optimizing", message: "Asking Google to shave off a few minutes…", percent: 80 });
  const optimized = await orderByGoogleDirections(startCoords, endCoords, selected);

  // ---------- 6) Build final stop list ----------
  const finalStops: Stop[] = [
    { name: startLocation, address: startLocation, ...startCoords, isCourse: false },
    ...optimized.map(courseToStop), // preserves rating/reviews
    { name: endLocation, address: endLocation, ...endCoords, isCourse: false },
  ];

  ping({ step: "finalize", message: "Bag packed. Route ready. Let’s roll! 🚗💨", percent: 100 });

  // ---------- 7) Return ----------
  return {
    stops: finalStops,
    totalDistance,
    totalDuration,
    discoveredCourses: uniqueCourses,
    topSuggestions: pool,
  };
}
