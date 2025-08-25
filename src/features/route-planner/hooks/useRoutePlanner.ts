import { useContext } from "react"
import { RoutePlannerContext } from "../context/RoutePlannerContext"

export const useRoutePlanner = () => {
  const context = useContext(RoutePlannerContext)
  if (!context) throw new Error("useRoutePlanner must be used within RoutePlannerProvider")
  return context
}
