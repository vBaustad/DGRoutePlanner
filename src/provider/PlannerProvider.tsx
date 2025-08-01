import { useState } from "react"
import { PlannerContext } from "../context/PlannerContext"
import type { TripPlanForm } from "../types/TripPlanForm"
import type { PlannerContextType, Step, Stop } from "../types/PlannerTypes"

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<Step>("start")
  const [form, setForm] = useState<TripPlanForm>({
    startLocation: '',
    endLocation: '',
    tripDays: 3,
    coursesPerDay: 2,
    maxDetourMinutes: 30,
    customStops: [],
  })

  const addStop = (stop: Stop) => {
    setForm((prev) => ({
      ...prev,
      customStops: [...prev.customStops, stop],
    }))
  }

  const removeStop = (index: number) => {
    setForm((prev) => {
      const updated = [...prev.customStops]
      updated.splice(index, 1)
      return {
        ...prev,
        customStops: updated,
      }
    })
  }

  const clearStops = () => {
    setForm((prev) => ({
      ...prev,
      customStops: [],
    }))
  }

  const value: PlannerContextType = {
    form,
    setForm,
    stops: form.customStops,
    addStop,
    removeStop,
    clearStops,
    isCourse: true,
    step,
    setStep,
  }

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  )
}
