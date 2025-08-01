export interface TripPlanForm {
  startLocation: string;
  endLocation: string;
  tripDays: number;
  coursesPerDay: number;
  maxDetourMinutes?: number;
  customStops?: {
    name: string;
    lat: number;
    lng: number;
  }[];
}
