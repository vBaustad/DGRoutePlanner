import type { Stop } from "./PlannerTypes";

export interface TripPlanForm {
  startLocation: string;
  endLocation: string;
  startCoords?: { lat: number; lng: number };
  endCoords?: { lat: number; lng: number };
  tripDays: number;
  coursesPerDay: number;
  maxDetourMinutes?: number;
  customStops: Stop[];
}
