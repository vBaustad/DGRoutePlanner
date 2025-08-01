import { createContext } from "react"
import type { PlannerContextType } from "../types/PlannerTypes"

export const PlannerContext = createContext<PlannerContextType | undefined>(undefined)
