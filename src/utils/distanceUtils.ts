// utils/distanceUtils.ts
import type { Stop } from "../types/PlannerTypes"

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function sortStopsByDistance(
  origin: { lat: number; lng: number },
  stops: Stop[]
): Stop[] {
  return [...stops].sort((a, b) => {
    const distA = haversineDistance(origin.lat, origin.lng, a.lat, a.lng)
    const distB = haversineDistance(origin.lat, origin.lng, b.lat, b.lng)
    return distA - distB
  })
}
