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

export type RoutePlannerContextType = {
  route: Stop[] | null
  loading: boolean
  planRoute: (form: TripPlanForm) => Promise<void>
  summary: RouteSummary | null
  topSuggestions: DiscGolfCourse[]
}

export interface CourseDiscoveryContextType {
  courses: DiscGolfCourse[]
  searchNearby: (lat: number, lng: number, radius?: number) => Promise<void>
}

export type RouteSummary = {
  totalKm: number
  totalHours: number
  perDayKm: number
  perDayHours: number
  courseCount: number
  stopCount: number
}

export interface DiscGolfCourse {
  place_id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
  reviews: number | null;
  city: string | null;
  country: string;
}


