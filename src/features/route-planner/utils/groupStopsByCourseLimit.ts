import type { Stop } from "../types/PlannerTypes"

export function groupStopsByCourseLimit(stops: Stop[], stopsPerDay: number) {
  const grouped: Record<number, Stop[]> = {}
  let courseCount = 0
  let currentDay = 1

  for (const stop of stops) {
    grouped[currentDay] = grouped[currentDay] || []
    grouped[currentDay].push(stop)

    if (stop.isCourse) {
      courseCount++
      if (courseCount % stopsPerDay === 0) {
        currentDay++
      }
    }
  }

  return grouped
}