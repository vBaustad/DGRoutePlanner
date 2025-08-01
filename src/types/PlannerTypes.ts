import type { TripPlanForm } from "./TripPlanForm"

export type Stop = {
  name: string
  lat: number
  lng: number
  address?: string
  isCourse: boolean
}

export type PlannerContextType = {
  form: TripPlanForm
  setForm: React.Dispatch<React.SetStateAction<TripPlanForm>>
  stops: Stop[]
  addStop: (stop: Stop) => void
  removeStop: (index: number) => void
  clearStops: () => void
  isCourse: boolean
}