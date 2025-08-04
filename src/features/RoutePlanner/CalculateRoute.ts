import { fetchGeocode } from "../../utils/geocode"
import type { TripPlanForm } from "../../types/TripPlanForm"
import type { Stop, DiscGolfCourse } from "../../types/PlannerTypes"
import { fetchCoursesNearby } from "../../utils/fetchCoursesNearby"
import { deduplicateCourses } from "../../utils/dediplicateCourses"


export async function calculateRoute(form: TripPlanForm): Promise<{
  stops: Stop[]
  totalDistance: number
  totalDuration: number
  discoveredCourses: DiscGolfCourse[]
  topSuggestions: DiscGolfCourse[]
}> {
  const {
    startLocation,
    endLocation,
    customStops,
    tripDays,
    coursesPerDay = 1,
    maxDetourMinutes = 30,
  } = form

  const startCoords = await fetchGeocode(startLocation)
  const endCoords = await fetchGeocode(endLocation)
  if (!startCoords || !endCoords) throw new Error("Geocoding failed")

  const stops: Stop[] = [
    { name: "Start", ...startCoords, isCourse: false },
    ...customStops,
    { name: "End", ...endCoords, isCourse: false },
  ]

  const waypoints = customStops.map((stop) => ({
    location: { lat: stop.lat, lng: stop.lng },
    stopover: true,
  }))

  const service = new google.maps.DirectionsService()
  const directions = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
    service.route(
      {
        origin: startCoords,
        destination: endCoords,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result)
        } else {
          reject(new Error("Directions API error: " + status))
        }
      }
    )
  })

  const legs = directions.routes[0].legs
  const totalDistance = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0)
  const totalDuration = legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0)

  // 🧠 Use evenly spaced route points to discover nearby courses
  const numCoursesNeeded = tripDays * coursesPerDay
  const interval = Math.max(1, Math.floor(legs.length / numCoursesNeeded))

  const foundCourses: DiscGolfCourse[] = []

  for (let i = 0; i < legs.length; i += interval) {
    const midpoint = legs[i].end_location
    const nearby = await fetchCoursesNearby(
      midpoint.lat(),
      midpoint.lng(),
      maxDetourMinutes * 1000 // convert "minutes" to meters for now (approx)
    )
    foundCourses.push(...nearby)
  }

  const uniqueCourses = deduplicateCourses(foundCourses)

    if (uniqueCourses.length > 0 && import.meta.env.PROD) {
    await fetch("/api/add-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uniqueCourses),
    });
    } else {
    console.log("🛑 Skipping course save — not in production");
    }

  const topSuggestions = uniqueCourses
    .filter(c => c.rating && c.reviews)
    .sort((a, b) => (b.rating! * b.reviews!) - (a.rating! * a.reviews!))
    .slice(0, numCoursesNeeded)

  return {
    stops,
    totalDistance,
    totalDuration,
    discoveredCourses: uniqueCourses,
    topSuggestions,
  }
}
