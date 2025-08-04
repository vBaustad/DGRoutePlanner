import { useState } from "react"
import { RoutePlannerContext } from "../context/RoutePlannerContext"
import { calculateRoute } from "../features/RoutePlanner/CalculateRoute"
import type { TripPlanForm } from "../types/TripPlanForm"
import type { Stop, RouteSummary, DiscGolfCourse } from "../types/PlannerTypes"

export const RoutePlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [route, setRoute] = useState<Stop[] | null>(null)
  const [summary, setSummary] = useState<RouteSummary | null>(null)
  const [topSuggestions, setTopSuggestions] = useState<DiscGolfCourse[]>([])
  const [loading, setLoading] = useState(false)

  const planRoute = async (form: TripPlanForm) => {
    setLoading(true)
    try {
      const result = await calculateRoute(form)
      console.log(result)
      setRoute(result.stops)
      setTopSuggestions(result.topSuggestions)

      setSummary(() => {
        const totalKm = result.totalDistance / 1000
        const totalHours = result.totalDuration / 3600
        const perDayKm = totalKm / form.tripDays
        const perDayHours = totalHours / form.tripDays
        const courseCount = form.customStops.filter(s => s.isCourse).length
        const stopCount = form.customStops.length

        return {
          totalKm,
          totalHours,
          perDayKm,
          perDayHours,
          courseCount,
          stopCount,
        }
      })

      if (result.topSuggestions.length > 0) {
        console.log(" Suggested courses:")
        result.topSuggestions.forEach((course, i) =>
          console.log(`${i + 1}. ${course.name} (${course.rating ?? "?"}⭐, ${course.reviews ?? 0} reviews)`)
        )
      } else {
        console.log("No suitable course suggestions found")
      }

    } catch (e) {
      console.error("Route planning failed:", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoutePlannerContext.Provider value={{ route, loading, planRoute, summary, topSuggestions }}>
      {children}
    </RoutePlannerContext.Provider>
  )
}
