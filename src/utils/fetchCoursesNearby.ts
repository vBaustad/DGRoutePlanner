import type { DiscGolfCourse } from '../types/PlannerTypes'

/**
 * Shared hidden div to host the PlacesService if not injected into a real map.
 */
function ensureHiddenMapContainer(): HTMLDivElement {
  let container = document.getElementById('hidden-places-service') as HTMLDivElement | null;

  if (!container) {
    container = document.createElement('div');
    container.id = 'hidden-places-service';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  return container;
}


/**
 * Fetches nearby disc golf courses using Google Maps JS SDK PlacesService.
 */
export async function fetchCoursesNearby(
  lat: number,
  lng: number,
  radius = 15000
): Promise<DiscGolfCourse[]> {
  const service = new google.maps.places.PlacesService(ensureHiddenMapContainer());

  return new Promise((resolve) => {
    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(lat, lng),
      radius,
      keyword: 'disc golf'
    };

    service.nearbySearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        return resolve([]);
      }

      const filtered = results
        .filter((place) => {
          const name = place.name?.toLowerCase() ?? '';
          const types = (place.types ?? []).join(',');
          return (
            name.includes('disc') &&
            name.includes('golf') &&
            !name.includes('shop') &&
            !types.includes('store')
          );
        })
        .map((place): DiscGolfCourse => ({
          place_id: place.place_id ?? '',
          name: place.name ?? 'Unknown',
          lat: place.geometry?.location?.lat() ?? 0,
          lng: place.geometry?.location?.lng() ?? 0,
          rating: place.rating ?? null,
          reviews: place.user_ratings_total ?? null,
          city: null,
          country: 'Norway'
        }));

      resolve(filtered);
    });
  });
}
