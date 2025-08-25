type LatLng = { lat: number; lng: number };
import type { DiscGolfCourse } from "../types/PlannerTypes";

/**
 * Let Google Directions choose the best visiting order for the given waypoints.
 * Returns the same courses in the optimized order.
 *
 * NOTE: max total waypoints for Directions is 25 (origin + destination + 23 waypoints).
 */
export async function orderByGoogleDirections(
  start: LatLng,
  end: LatLng,
  courses: DiscGolfCourse[]
): Promise<DiscGolfCourse[]> {
  if (courses.length <= 1) return courses;

  // Directions limit guard (keep the best N if needed, or batch by yourself)
  const capped = courses.slice(0, 23); // 23 waypoints + 2 endpoints = 25 total

  const svc = new google.maps.DirectionsService();
  const res = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
    svc.route(
      {
        origin: new google.maps.LatLng(start.lat, start.lng),
        destination: new google.maps.LatLng(end.lat, end.lng),
        waypoints: capped.map(c => ({
          location: new google.maps.LatLng(c.lat, c.lng),
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true, // <-- the magic
      },
      (r, status) => {
        if (status === google.maps.DirectionsStatus.OK && r) resolve(r);
        else reject(new Error(`Directions optimize failed: ${status}`));
      }
    );
  });

  const order = res.routes[0].waypoint_order; // e.g. [2, 0, 1, ...]
  return order.map(idx => capped[idx]);
}
