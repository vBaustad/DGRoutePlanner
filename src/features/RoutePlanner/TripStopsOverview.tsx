import { usePlanner } from "../../hooks/usePlanner"
import { useRoutePlanner } from "../../hooks/useRoutePlanner"
import type { Stop } from "../../types/PlannerTypes"

export function TripStopsOverview() {
  const { form, setForm, clearStops, setStep } = usePlanner()
  const { route } = useRoutePlanner()
  const { startLocation, endLocation, coursesPerDay = 2, customStops = [] } = form

  const isRoundTrip =
    form.startCoords &&
    form.endCoords &&
    Math.abs(form.startCoords.lat - form.endCoords.lat) < 0.001 &&
    Math.abs(form.startCoords.lng - form.endCoords.lng) < 0.001

  const resetPlanner = () => {
    setForm({
      startLocation: "",
      endLocation: "",
      tripDays: 3,
      coursesPerDay: 2,
      maxDetourMinutes: 30,
      customStops: [],
    })
    clearStops()
    setStep("start")
  }

  // 👇 This decides what to show: full route if planned, fallback to planner form data
  const stopsToRender: Stop[] =
    route ?? [
      ...(form.startCoords ? [{ name: startLocation, ...form.startCoords, isCourse: false }] : []),
      ...customStops,
      ...(form.endCoords ? [{ name: endLocation, ...form.endCoords, isCourse: false }] : []),
    ]

  // Group by day
  const groupedByDay: Record<number, Stop[]> = {}
  let courseCount = 0
  let currentDay = 1

  for (const stop of stopsToRender) {
    groupedByDay[currentDay] = groupedByDay[currentDay] || []
    groupedByDay[currentDay].push(stop)

    if (stop.isCourse) {
      courseCount++
      if (courseCount % coursesPerDay === 0) {
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
        <p className="text-sm text-gray-500 mb-4">
          Round trip mode enabled – your stops will loop back to the start.
        </p>
      )}

      {Object.entries(groupedByDay).map(([day, stops]) => (
        <div key={day} className="mb-6">
          <h4 className="text-base font-semibold text-gray-700 mb-2">Day {day}</h4>
          <ul className="space-y-2">
            {stops.map((stop, index) => (
              <li key={index} className="flex items-start justify-between gap-3 bg-base-200 p-3 rounded">
                <div className="flex gap-3">
                  <div className="mt-1 text-blue-500">📍</div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {stop.name}
                      {index === 0 && !stop.isCourse && (
                        <span className="badge badge-sm">Start</span>
                      )}
                      {stop.isCourse && stop.isSuggested && (
                        <span className="badge badge-sm badge-info">Suggested</span>
                      )}
                      {stop.isCourse && !stop.isSuggested && (
                        <span className="badge badge-sm badge-accent">Custom</span>
                      )}
                      {index === stops.length - 1 && !stop.isCourse && (
                        <span className="badge badge-sm badge-success">End</span>
                      )}
                    </p>
                    {stop.address && (
                      <p className="text-sm text-gray-600">{stop.address}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {(startLocation || endLocation || stopsToRender.length > 0) && (
        <div className="mt-4 text-right">
          <button onClick={resetPlanner} className="btn btn-sm btn-outline">
            🔄 Start Over
          </button>
        </div>
      )}
    </div>
  )
}
