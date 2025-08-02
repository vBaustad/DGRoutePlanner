import { useState } from "react"
import { CourseDiscoveryContext } from "../context/CourseDiscoveryContext"
import { fetchCoursesNearby } from "../utils/fetchCoursesNearby"
import type { DiscGolfCourse } from "../types/PlannerTypes"

export const CourseDiscoveryProvider = ({ children }: { children: React.ReactNode }) => {
  const [courses, setCourses] = useState<DiscGolfCourse[]>([])

  const searchNearby = async (lat: number, lng: number, radius = 15000) => {
    try {
      const found = await fetchCoursesNearby(lat, lng, radius)

      // Avoid duplicates (by place_id)
      const knownIds = new Set(courses.map(c => c.place_id))
      const newOnes = found.filter(c => !knownIds.has(c.place_id))

      if (newOnes.length > 0) {
        setCourses(prev => [...prev, ...newOnes])
      }
    } catch (error) {
      console.error("Failed to search nearby courses:", error)
    }
  }

  return (
    <CourseDiscoveryContext.Provider value={{ courses, searchNearby }}>
      {children}
    </CourseDiscoveryContext.Provider>
  )
}
