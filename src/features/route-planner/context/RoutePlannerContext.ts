import { createContext } from "react"
import type { RoutePlannerContextType } from "../types/PlannerTypes"

export const RoutePlannerContext = createContext<RoutePlannerContextType | undefined>(undefined)

