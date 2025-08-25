// features/RoutePlanner/courseToStop.ts
import type { DiscGolfCourse, Stop } from "../types/PlannerTypes";

export function courseToStop(c: DiscGolfCourse): Stop {
  return {
    name: c.name,
    lat: c.lat,
    lng: c.lng,
    isCourse: true,
    isSuggested: true,
    courseId: c.place_id,
    rating: c.rating,
    reviews: c.reviews,
  };
}
