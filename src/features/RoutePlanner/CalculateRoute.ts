import { fetchGeocode } from "../../utils/geocode"
import type { TripPlanForm } from "../../types/TripPlanForm"
import type { Stop, DiscGolfCourse } from "../../types/PlannerTypes"
import { fetchCoursesNearby } from "../../utils/fetchCoursesNearby"
import { deduplicateCourses } from "../../utils/deduplicateCourses"
import { orderCoursesByDrivingDistance } from "../../utils/routeOptimizer"

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
    {
      name: form.startLocation,
      address: form.startLocation,
      ...startCoords,
      isCourse: false,
    },
    ...customStops,
    {
      name: form.endLocation,
      address: form.endLocation,
      ...endCoords,
      isCourse: false,
    },
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

  const path = directions.routes[0].overview_path
  const totalPoints = path.length

  const numCoursesNeeded = tripDays * coursesPerDay
  const numSamples = Math.max(numCoursesNeeded * 2, 10)
  const interval = Math.floor(totalPoints / numSamples)

  const foundCourses: DiscGolfCourse[] = []
  for (let i = 0; i < totalPoints; i += interval) {
    const point = path[i]
    const nearby = await fetchCoursesNearby(
      point.lat(),
      point.lng(),
      (maxDetourMinutes / 2) * 1000
    )
    foundCourses.push(...nearby)
  }

  const uniqueCourses = deduplicateCourses(foundCourses)

  if (uniqueCourses.length > 0 && import.meta.env.PROD) {
    await fetch("/api/add-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uniqueCourses),
    })
  } else {
    console.log("🛑 Skipping course save — not in production")
  }

  function calculateScore(course: DiscGolfCourse): number {
    const rating = course.rating ?? 0
    const reviews = course.reviews ?? 0
    return Math.pow(rating, 1.5) * Math.log10(reviews + 1)
  }

  const topSuggestions = uniqueCourses
    .filter(c => c.rating && c.reviews)
    .sort((a, b) => calculateScore(b) - calculateScore(a))
    .slice(0, numCoursesNeeded)

  const orderedSuggestions = await orderCoursesByDrivingDistance(startCoords, topSuggestions)

  const suggestedStops: Stop[] = orderedSuggestions.map((course) => ({
    name: course.name,
    lat: course.lat,
    lng: course.lng,
    isCourse: true,
    isSuggested: true,
    courseId: course.place_id,
  }))

  return {
    stops: [...stops.slice(0, -1), ...suggestedStops, stops[stops.length - 1]],
    totalDistance,
    totalDuration,
    discoveredCourses: uniqueCourses,
    topSuggestions,
  }
}
