import type { Stop } from "../types/PlannerTypes";

export async function getRouteTotalsForStops(
  stops: Stop[],
  departureTime: Date
): Promise<{ totalDistance: number; totalDuration: number; directions: google.maps.DirectionsResult }> {
  if (stops.length < 2) throw new Error("Need at least origin and destination");

  const ds = new google.maps.DirectionsService();

  const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
    ds.route(
      {
        origin: { lat: stops[0].lat, lng: stops[0].lng },
        destination: { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng },
        waypoints: stops.slice(1, -1).map(s => ({
          location: { lat: s.lat, lng: s.lng },
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        optimizeWaypoints: false,
        drivingOptions: {
          departureTime,
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK && res) resolve(res);
        else reject(new Error("Directions API error: " + status));
      }
    );
  });

  const legs = result.routes[0]?.legs ?? [];
  const totalDistance = legs.reduce((sum, leg) => sum + (leg.distance?.value ?? 0), 0);
  const totalDuration = legs.reduce(
    (sum, leg) => sum + (leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0),
    0
  );

  return { totalDistance, totalDuration, directions: result };
}