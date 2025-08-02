import { createContext } from "react"
import type { CourseDiscoveryContextType } from "../types/PlannerTypes"

export const CourseDiscoveryContext = createContext<CourseDiscoveryContextType>({
  courses: [],
  searchNearby: async () => {},
})
