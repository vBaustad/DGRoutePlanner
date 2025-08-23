// utils/fetchCoursesNearby.ts
import type { DiscGolfCourse } from "../types/PlannerTypes";

type PlaceDisplayName = string | { text?: string } | null | undefined;

function unwrapDisplayName(dn: PlaceDisplayName): string {
  return typeof dn === "string" ? dn : dn?.text ?? "";
}

function toLatLngLiteral(
  loc: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined
): google.maps.LatLngLiteral {
  if (!loc) return { lat: 0, lng: 0 };
  return typeof (loc as google.maps.LatLng).lat === "function"
    ? { lat: (loc as google.maps.LatLng).lat(), lng: (loc as google.maps.LatLng).lng() }
    : (loc as google.maps.LatLngLiteral);
}

function looksLikeCourse(name: string, types: readonly string[] | undefined): boolean {
  const n = name.toLowerCase();
  const t = (types ?? []).join(",");
  const hits =
    n.includes("disc golf") ||
    n.includes("discgolf") ||
    n.includes("frisbeegolf") ||
    n.includes("frisbee golf") ||
    n.includes("discgolfbane") ||
    n.includes("frisbeegolfbane") ||
    (n.includes("disc") && (n.includes("golf") || n.includes("bane")));
  const shop =
    n.includes("shop") ||
    t.includes("store") ||
    t.includes("bicycle_store") ||
    t.includes("clothing_store") ||
    t.includes("home_goods_store");
  return hits && !shop;
}

function mapPlaceToCourse(p: google.maps.places.Place): DiscGolfCourse | null {
  const id = p.id ?? "";
  const name = unwrapDisplayName(p.displayName);
  const loc = toLatLngLiteral(p.location);
  if (!id || !name || !loc) return null;
  return {
    place_id: id,
    name,
    lat: loc.lat,
    lng: loc.lng,
    rating: p.rating ?? null,
    reviews: p.userRatingCount ?? null,
    city: null,
    country: "",
  };
}

const clampRadius = (r: number) => Math.min(Math.max(1, Math.floor(r)), 50000);

async function nearbyPass(
  lat: number,
  lng: number,
  radius: number
): Promise<google.maps.places.Place[]> {
  const R = clampRadius(radius);
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const { places } = await Place.searchNearby({
    fields: ["id", "displayName", "location", "rating", "userRatingCount", "types"],
    locationRestriction: { center: new google.maps.LatLng(lat, lng), radius: R },
    includedPrimaryTypes: ["park", "tourist_attraction"],
    maxResultCount: 20,
    rankPreference: google.maps.places.SearchNearbyRankPreference.POPULARITY,
  });
  return places ?? [];
}

async function textPass(
  lat: number,
  lng: number,
  radius: number,
  query: string
): Promise<google.maps.places.Place[]> {
  const R = clampRadius(radius);
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const resp = await Place.searchByText({
    fields: ["id", "displayName", "location", "rating", "userRatingCount", "types"],
    textQuery: query,
    locationBias: { center: new google.maps.LatLng(lat, lng), radius: R },
    language: "en",
  });
  return resp.places ?? [];
}

export async function fetchCoursesNearby(
  lat: number,
  lng: number,
  radius = 15000
): Promise<DiscGolfCourse[]> {
  const R = clampRadius(radius);

  const nearby = await nearbyPass(lat, lng, R);
  const nearbyFiltered = nearby.filter((p) =>
    looksLikeCourse(unwrapDisplayName(p.displayName), p.types)
  );

  const keywords = [
    "disc golf",
    "discgolf",
    "frisbeegolf",
    "disc golf course",
    "discgolfbane",
    "frisbee golf",
  ];
  const textArrays = await Promise.all(keywords.map((q) => textPass(lat, lng, R, q)));
  const textFlat = textArrays.flat();
  const textFiltered = textFlat.filter((p) =>
    looksLikeCourse(unwrapDisplayName(p.displayName), p.types)
  );

  const seen = new Set<string>();
  const courses: DiscGolfCourse[] = [];
  for (const p of [...nearbyFiltered, ...textFiltered]) {
    const mapped = mapPlaceToCourse(p);
    if (!mapped) continue;
    if (seen.has(mapped.place_id)) continue;
    seen.add(mapped.place_id);
    courses.push(mapped);
  }

  console.log("[fetchCoursesNearby]", {
    radiusRequested: radius,
    radiusUsed: R,
    nearbyRaw: nearby.length,
    nearbyKept: nearbyFiltered.length,
    textRaw: textFlat.length,
    textKept: textFiltered.length,
    deduped: courses.length,
  });

  return courses;
}
