import type { TripPlanForm } from "./TripPlanForm"

export type Stop = {
  name: string
  lat: number
  lng: number
  address?: string
  isCourse: boolean
}

export type Step = "start" | "end" | "stops" | "final"

export type PlannerContextType = {
  form: TripPlanForm
  setForm: React.Dispatch<React.SetStateAction<TripPlanForm>>
  stops: Stop[]
  addStop: (stop: Stop) => void
  removeStop: (index: number) => void
  clearStops: () => void
  isCourse: boolean
  step: Step
  setStep: React.Dispatch<React.SetStateAction<Step>>
}