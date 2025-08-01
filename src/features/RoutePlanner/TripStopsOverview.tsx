import { usePlanner } from "../../hooks/usePlanner"

export function TripStopsOverview() {
  const { form, stops, setForm, clearStops, setStep } = usePlanner()
  const { startLocation, endLocation, coursesPerDay = 2 } = form

  const isRoundTrip =
    form.startCoords &&
    form.endCoords &&
    Math.abs(form.startCoords.lat - form.endCoords.lat) < 0.001 &&
    Math.abs(form.startCoords.lng - form.endCoords.lng) < 0.001

  const removeStop = (index: number) => {
    const updated = [...(form.customStops ?? [])]
    updated.splice(index, 1)
    setForm((prev) => ({
      ...prev,
      customStops: updated,
    }))
  }

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

  const groupedByDay: Record<number, typeof stops> = {}
  let courseCount = 0
  let currentDay = 1

  for (const stop of stops) {
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
        <p className="text-sm text-gray-500 mb-2">
          Round trip mode enabled – your stops will loop back to the start.
        </p>
      )}

      {startLocation && (
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-700 mb-1">Start</h4>
          <div className="flex items-start gap-3 bg-base-200 p-3 rounded">
            <div className="mt-1 text-primary">📍</div>
            <div>
              <p className="font-medium text-gray-900">{startLocation}</p>
            </div>
          </div>
        </div>
      )}

      {form.customStops.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-base font-semibold text-gray-700">Custom Stops</h4>
          <ul className="space-y-2">
            {form.customStops.map((stop, index) => (
              <li key={index} className="flex items-start justify-between gap-3 bg-base-200 p-3 rounded">
                <div className="flex gap-3">
                  <div className="mt-1 text-blue-500">🥏</div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {stop.name}
                      {stop.isCourse && (
                        <span className="badge badge-sm badge-accent">Course</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{stop.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeStop(index)}
                  className="btn btn-xs btn-outline btn-error self-start"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}


      {endLocation && (
        <div className="mt-2">
          <h4 className="text-base font-semibold text-gray-700 mb-1">End</h4>
          <div className="flex items-start gap-3 bg-base-200 p-3 rounded">
            <div className="mt-1 text-success">🏁</div>
            <div>
              <p className="font-medium text-gray-900">{endLocation}</p>
            </div>
          </div>
        </div>
      )}

      {(startLocation || endLocation || stops.length > 0) && (
        <div className="mt-6 text-right">
          <button
            onClick={resetPlanner}
            className="btn btn-sm btn-outline"
          >
            🔄 Start Over
          </button>
        </div>
      )}
    </div>
  )
}
