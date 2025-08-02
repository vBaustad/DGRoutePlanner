import { useCallback, useRef } from 'react';
import type { DiscGolfCourse } from '../types/PlannerTypes';

export function useCourseDiscovery() {
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);

  const setServiceContainer = useCallback((map: google.maps.Map) => {
    serviceRef.current = new google.maps.places.PlacesService(map);
  }, []);

  const discoverCourses = useCallback(
    (lat: number, lng: number, radius = 15000): Promise<DiscGolfCourse[]> => {
      return new Promise((resolve, reject) => {
        if (!serviceRef.current) return reject('PlacesService not initialized');

        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(lat, lng),
          radius,
          keyword: 'disc golf'
        };

        serviceRef.current.nearbySearch(request, (results, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
            return reject(status);
          }

          const filtered: DiscGolfCourse[] = results
            .filter(place => {
              const name = place.name?.toLowerCase() ?? '';
              const types = place.types?.join(',') ?? '';
              return name.includes('disc') && name.includes('golf') && !types.includes('store');
            })
            .map(place => ({
              place_id: place.place_id!,
              name: place.name!,
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
    },
    []
  );

  return { setServiceContainer, discoverCourses };
}
