import type { TripPlanForm } from "./TripPlanForm"

export type Stop = {
  name: string
  lat: number
  lng: number
  address?: string
  isCourse: boolean
  rating?: number | null
  reviews?: number | null
  isSuggested?: boolean
  courseId?: string
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

export interface RoutePlannerContextType {
  route: Stop[] | null;
  summary: RouteSummary | null;
  topSuggestions: DiscGolfCourse[];
  loading: boolean;
  progress: RouteProgress | null;   // <-- add this
  planRoute: (form: TripPlanForm) => Promise<void>;
  refreshSuggestions: () => Promise<DiscGolfCourse[]>;
  removeSuggestedStop: (placeId: string) => Promise<void>;
  resetRoute: () => void;
}

export type RouteProgress =
  | { step: "init";        message: string; percent?: number }
  | { step: "geocode";     message: string; percent?: number }
  | { step: "directions";  message: string; percent?: number }
  | { step: "scanning";    message: string; percent?: number }
  | { step: "filtering";   message: string; percent?: number }
  | { step: "ranking";     message: string; percent?: number }
  | { step: "optimizing";  message: string; percent?: number }
  | { step: "finalize";    message: string; percent?: number };


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


