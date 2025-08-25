import { useContext } from "react"
import { PlannerContext } from "../context/PlannerContext"

export const usePlanner = () => {
  const context = useContext(PlannerContext)
  if (!context) throw new Error("usePlanner must be used within a PlannerProvider")
  return context
}
