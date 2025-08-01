import { useState } from "react"
import { PlannerContext } from "../context/PlannerContext"
import type { TripPlanForm } from "../types/TripPlanForm"
import type { Stop } from "../types/PlannerTypes"

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [form, setForm] = useState<TripPlanForm>({
    startLocation: '',
    endLocation: '',
    tripDays: 3,
    coursesPerDay: 2,
    maxDetourMinutes: 30,
    customStops: [],
  })

  const [stops, setStops] = useState<Stop[]>([])

  const addStop = (stop: Stop) => setStops((prev) => [...prev, stop])
  const removeStop = (index: number) => setStops((prev) => prev.filter((_, i) => i !== index))
  const clearStops = () => setStops([])

  return (
    <PlannerContext.Provider value={{ form, setForm, stops, addStop, removeStop, clearStops, isCourse: true }}>
      {children}
    </PlannerContext.Provider>
  )
}
