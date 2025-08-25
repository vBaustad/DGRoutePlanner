import { useCallback } from 'react';
import type { DiscGolfCourse } from '../types/PlannerTypes';

// Minimal shape we rely on from the new Places API
type PlaceDisplayName = string | { text?: string } | undefined;

interface PlaceLite {
  id?: string;
  displayName?: PlaceDisplayName;
  location?: google.maps.LatLng | google.maps.LatLngLiteral | null;
  types?: string[];
  rating?: number;
  userRatingCount?: number;
}

// ---- helpers (typed, no any) ----
function unwrapDisplayName(dn: PlaceDisplayName): string {
  return typeof dn === 'string' ? dn : dn?.text ?? '';
}

function toLatLngLiteral(
  loc: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined
): google.maps.LatLngLiteral {
  if (!loc) return { lat: 0, lng: 0 };
  // LatLng instance has .lat()/.lng()
  return typeof (loc as google.maps.LatLng).lat === 'function'
    ? { lat: (loc as google.maps.LatLng).lat(), lng: (loc as google.maps.LatLng).lng() }
    : (loc as google.maps.LatLngLiteral);
}

export function useCourseDiscovery() {
  const discoverCourses = useCallback(
    async (lat: number, lng: number, radius = 15000): Promise<DiscGolfCourse[]> => {
      // Ensure 'places' library is loaded
      const { Place } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;

      const { places } = await Place.searchNearby({
        fields: ['id', 'displayName', 'location', 'rating', 'userRatingCount', 'types'],
        locationRestriction: {
          center: new google.maps.LatLng(lat, lng),
          radius,
        },
        // optional; tune as you like
        includedPrimaryTypes: ['park', 'tourist_attraction'],
        maxResultCount: 20,
        rankPreference: google.maps.places.SearchNearbyRankPreference.POPULARITY,
      });

      const filtered: DiscGolfCourse[] = (places as PlaceLite[] | undefined ?? [])
        .filter((p) => {
          const name = unwrapDisplayName(p.displayName).toLowerCase();
          const types = (p.types ?? []).join(',');
          return name.includes('disc') && name.includes('golf') && !types.includes('store');
        })
        .map((p) => {
          const pos = toLatLngLiteral(p.location);
          return {
            place_id: p.id ?? '',
            name: unwrapDisplayName(p.displayName) || 'Unknown',
            lat: pos.lat,
            lng: pos.lng,
            rating: p.rating ?? null,
            reviews: p.userRatingCount ?? null,
            city: null,
            country: 'Norway', // keep your previous default
          } as DiscGolfCourse;
        });

      return filtered;
    },
    []
  );

  return { discoverCourses };
}
