// utils/routeOptimizer.ts
import type { DiscGolfCourse } from "../types/PlannerTypes"

export async function findClosestCourseByRoad(
  origin: { lat: number; lng: number },
  candidates: DiscGolfCourse[]
): Promise<{ closest: DiscGolfCourse; remaining: DiscGolfCourse[] }> {
  const service = new google.maps.DistanceMatrixService()
  const destinations = candidates.map((c) => ({ lat: c.lat, lng: c.lng }))

  const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) resolve(result)
        else reject(new Error("DistanceMatrix API failed: " + status))
      }
    )
  })

  const distances = response.rows[0].elements
  const indexed = candidates.map((course, i) => ({
    course,
    distance: distances[i].distance?.value ?? Infinity,
  }))

  indexed.sort((a, b) => a.distance - b.distance)

  const [closestEntry] = indexed
  const remaining = candidates.filter(c => c.place_id !== closestEntry.course.place_id)

  return { closest: closestEntry.course, remaining }
}

export async function orderCoursesByDrivingDistance(
  start: { lat: number; lng: number },
  courses: DiscGolfCourse[]
): Promise<DiscGolfCourse[]> {
  let currentPoint = start
  let remaining = [...courses]
  const ordered: DiscGolfCourse[] = []

  while (remaining.length > 0) {
    const { closest, remaining: nextRemaining } = await findClosestCourseByRoad(currentPoint, remaining)
    ordered.push(closest)
    currentPoint = { lat: closest.lat, lng: closest.lng }
    remaining = nextRemaining
  }

  return ordered
}
