// utils/deduplicateCourses.ts
import type { DiscGolfCourse } from "../types/PlannerTypes"

export function deduplicateCourses(courses: DiscGolfCourse[]): DiscGolfCourse[] {
  const seen = new Map<string, DiscGolfCourse>()
  for (const course of courses) {
    if (!seen.has(course.place_id)) {
      seen.set(course.place_id, course)
    }
  }
  return Array.from(seen.values())
}
