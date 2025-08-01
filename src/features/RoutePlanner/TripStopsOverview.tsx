import { useEffect, useState } from "react";
import { usePlanner } from "../../hooks/usePlanner"
import { fetchGeocode } from "../../utils/geocode";

export function TripStopsOverview() {
  const { stops, form } = usePlanner()
  const [startCoords, setStartCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [endCoords, setEndCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
  const lookup = async () => {
    if (form.startLocation) {
      const coords = await fetchGeocode(form.startLocation)
      setStartCoords(coords)
    }
    if (form.endLocation) {
      const coords = await fetchGeocode(form.endLocation)
      setEndCoords(coords)
    }
  }
  lookup()
}, [form.startLocation, form.endLocation])


  const isRoundTrip =
    startCoords &&
    endCoords &&
    Math.abs(startCoords.lat - endCoords.lat) < 0.001 &&
    Math.abs(startCoords.lng - endCoords.lng) < 0.001


 
  const stopsPerDay = form.coursesPerDay || 2
  const groupedByDay: Record<number, typeof stops> = {}
  let courseCount = 0
  let currentDay = 1

  for (const stop of stops) {
    groupedByDay[currentDay] = groupedByDay[currentDay] || []
    groupedByDay[currentDay].push(stop)

    if (stop.isCourse) {
      courseCount++
      if (courseCount % stopsPerDay === 0) {
        currentDay++
      }
    }
  }


  return (
    <div className="h-full rounded-lg border border-base-200 bg-white p-6 shadow-sm flex flex-col">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-base-content mb-4">
        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
        </svg>
        Planned Disc Golf Stops
      </h3>

      {isRoundTrip && (
        <p className="text-sm text-gray-500 mb-2">
          Round trip mode enabled – your stops will loop back to the start.
        </p>
      )}

      {Object.entries(groupedByDay).map(([day, dayStops]) => (
        <div key={day} className="space-y-2 mb-4">
          <h4 className="text-base font-semibold text-gray-700">Day {day}</h4>
          <ul className="space-y-2">
            {dayStops.map((stop, i) => (
              <li key={i} className="flex items-start gap-3 bg-base-200 p-3 rounded">
                <div className="mt-1">
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    {stop.name}
                    {stop.isCourse && (
                      <span className="badge badge-sm badge-accent">Course</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stop.address ?? `${stop.lat.toFixed(4)}, ${stop.lng.toFixed(4)}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
