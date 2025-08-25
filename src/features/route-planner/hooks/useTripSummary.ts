// hooks/useTripSummary.ts
import { useMemo } from "react";
import { useRoutePlanner } from "./useRoutePlanner";
import type { Stop } from "../types/PlannerTypes";

export function useTripSummary() {
  const { route, summary } = useRoutePlanner();

  const value = useMemo(() => {
    const totalKm =
      summary?.totalKm != null
        ? summary.totalKm
        : roughKmFromStops(route ?? []);

    const totalHours =
      summary?.totalHours != null
        ? summary.totalHours
        : totalKm > 0
        ? round1(Math.max(0.1, totalKm / 70)) // ~70 km/h fallback
        : 0;

    return { route: route ?? [], totalKm, totalHours };
  }, [route, summary]);

  return value;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function roughKmFromStops(stops: Stop[]) {
  if (!stops || stops.length < 2) return 0;
  let sum = 0;
  for (let i = 0; i < stops.length - 1; i++) sum += haversineKm(stops[i], stops[i + 1]);
  return round1(sum * 1.15); // add ~15% since roads are longer than straight line
}

function haversineKm(a: Stop, b: Stop) {
  const R = 6371;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
