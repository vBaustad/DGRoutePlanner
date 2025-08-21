// provider/RoutePlannerProvider.tsx
import { useState, useRef, useCallback } from "react";
import { RoutePlannerContext } from "../context/RoutePlannerContext";
import { calculateRoute } from "../features/RoutePlanner/CalculateRoute";
import type { TripPlanForm } from "../types/TripPlanForm";
import type {
  Stop,
  RouteSummary,
  DiscGolfCourse,
  RouteProgress,            // <-- import
} from "../types/PlannerTypes";

export const RoutePlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [route, setRoute] = useState<Stop[] | null>(null);
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  const [topSuggestions, setTopSuggestions] = useState<DiscGolfCourse[]>([]);
  const [removedPlaceIds, setRemovedPlaceIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);                // keep loading
  const [progress, setProgress] = useState<RouteProgress | null>(null); // <-- typed

  const lastFormRef = useRef<TripPlanForm | null>(null);

  const planRoute = useCallback(async (form: TripPlanForm) => {
    setLoading(true);
    setProgress({ step: "init", message: "Sharpening discs…", percent: 2 });
    lastFormRef.current = form;
    setRemovedPlaceIds(new Set());

    try {
      const args = {
        form,
        excludedPlaceIds: removedPlaceIds,                   // reuse the current set
        onProgress: (p: RouteProgress) => setProgress(p),   // <-- typed
      };

      const result = await calculateRoute(args);            // <-- fixes overload

      setRoute(result.stops);
      setTopSuggestions(result.topSuggestions);

      const totalKm = result.totalDistance / 1000;
      const totalHours = result.totalDuration / 3600;
      const perDayKm = totalKm / form.tripDays;
      const perDayHours = totalHours / form.tripDays;
      const courseCount = (form.customStops ?? []).filter(s => s.isCourse).length;
      const stopCount = (form.customStops ?? []).length;

      setSummary({ totalKm, totalHours, perDayKm, perDayHours, courseCount, stopCount });
      setProgress({ step: "finalize", message: "Bag packed. Let’s play! 🥏", percent: 100 });
    } catch (e) {
      console.error("Route planning failed:", e);
      setProgress({ step: "finalize", message: "Uh oh—route failed. Try again?", percent: 100 });
    } finally {
      setLoading(false);
    }
  }, [removedPlaceIds]);

  const refreshSuggestions = useCallback(async (): Promise<DiscGolfCourse[]> => {
    if (!lastFormRef.current) return [];
    try {
      const args = {
        form: lastFormRef.current,
        excludedPlaceIds: removedPlaceIds,
        mode: "suggestionsOnly" as const,
      };
      const result = await calculateRoute(args);
      setTopSuggestions(result.topSuggestions);
      return result.topSuggestions;
    } catch (e) {
      console.error("Failed to refresh suggestions:", e);
      return [];
    }
  }, [removedPlaceIds]);

  const removeSuggestedStop = useCallback(async (placeId: string): Promise<void> => {
    if (!route) return;

    let nextRemoved = new Set<string>();
    setRemovedPlaceIds(prev => {
      nextRemoved = new Set(prev);
      nextRemoved.add(placeId);
      return nextRemoved;
    });

    const removedIndex = route.findIndex(s => s.courseId === placeId);
    if (removedIndex < 0) return;

    const updatedRoute = route.filter(s => s.courseId !== placeId);

    const usedPlaceIds = new Set<string>((updatedRoute.map(s => s.courseId).filter(Boolean) as string[]));
    let replacement = topSuggestions.find(c => !usedPlaceIds.has(c.place_id) && !nextRemoved.has(c.place_id));

    if (!replacement) {
      const fresh = await refreshSuggestions();
      replacement = fresh.find(c => !usedPlaceIds.has(c.place_id) && !nextRemoved.has(c.place_id));
    }

    if (replacement) {
      const newStop: Stop = {
        name: replacement.name,
        lat: replacement.lat,
        lng: replacement.lng,
        isCourse: true,
        isSuggested: true,
        courseId: replacement.place_id,
      };
      updatedRoute.splice(removedIndex, 0, newStop);
    }

    setRoute(updatedRoute);
  }, [route, topSuggestions, refreshSuggestions]);

  const resetRoute = useCallback(() => {
    setRoute(null);
    setSummary(null);
    setTopSuggestions([]);
    setRemovedPlaceIds(new Set());
    setProgress(null);                   // <-- also clear progress
    lastFormRef.current = null;
  }, []);

  return (
    <RoutePlannerContext.Provider
      value={{
        route,
        loading,
        progress,                         // <-- expose progress
        planRoute,
        summary,
        topSuggestions,
        removeSuggestedStop,
        refreshSuggestions,
        resetRoute,
      }}
    >
      {children}
    </RoutePlannerContext.Provider>
  );
};
