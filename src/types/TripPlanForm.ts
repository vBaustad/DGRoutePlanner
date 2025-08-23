import type { Stop } from "./PlannerTypes";

// Forbid isSuggested in form data
type FormStop = Omit<Stop, "isSuggested"> & { isSuggested?: never };

// Reuse Stop's lat/lng shape for cached coords
type LatLng = Pick<Stop, "lat" | "lng">;

export interface TripPlanForm {
  startLocation: string;
  endLocation: string;
  tripDays: number;
  coursesPerDay: number;
  maxDetourMinutes?: number;
  maxDriveHoursPerDay?: number;

  // OPTIONAL UI caches (set when user picks a place so we can render before routing)
  startCoords?: LatLng;
  endCoords?: LatLng;

  customStops?: FormStop[];
}
