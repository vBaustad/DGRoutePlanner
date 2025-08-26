import { useMemo, useState, useCallback } from "react";
import { usePlanner } from "../hooks/usePlanner";
import { useRoutePlanner } from "../hooks/useRoutePlanner";
import type { Stop } from "../types/PlannerTypes";
import { TripSummaryBar } from "./TripSummaryBar";

export function TripStopsOverview() {
  const { form, setForm, clearStops, setStep } = usePlanner();
  const { route, removeSuggestedStop, resetRoute } = useRoutePlanner();
  const { startLocation, endLocation, coursesPerDay = 2, customStops = [] } = form;

  const [removingId, setRemovingId] = useState<string | null>(null);

  const isRoundTrip =
    form.startCoords &&
    form.endCoords &&
    Math.abs(form.startCoords.lat - form.endCoords.lat) < 0.001 &&
    Math.abs(form.startCoords.lng - form.endCoords.lng) < 0.001;

  const resetPlanner = useCallback(() => {
    setForm({
      startLocation: "",
      endLocation: "",
      tripDays: 3,
      coursesPerDay: 2,
      maxDetourMinutes: 30,
      startCoords: undefined,
      endCoords: undefined,
      customStops: [],
    });
    clearStops();
    setStep("start");
    resetRoute();
  }, [setForm, clearStops, resetRoute, setStep]);

  const stopsToRender: Stop[] = useMemo(
    () =>
      route ?? [
        ...(form.startCoords ? [{ name: startLocation, ...form.startCoords, isCourse: false }] : []),
        ...customStops,
        ...(form.endCoords ? [{ name: endLocation, ...form.endCoords, isCourse: false }] : []),
      ],
    [route, form.startCoords, form.endCoords, startLocation, endLocation, customStops]
  );

  const groupedByDay = useMemo(() => {
    const grouped: Record<number, Stop[]> = {};
    let courseCount = 0;
    let currentDay = 1;
    for (const stop of stopsToRender) {
      if (!grouped[currentDay]) grouped[currentDay] = [];
      grouped[currentDay].push(stop);
      if (stop.isCourse) {
        courseCount++;
        if (courseCount % coursesPerDay === 0) currentDay++;
      }
    }
    return grouped;
  }, [stopsToRender, coursesPerDay]);

  const handleRemove = useCallback(
    async (courseId?: string) => {
      if (!courseId) return;
      try {
        setRemovingId(courseId);
        await removeSuggestedStop(courseId);
      } finally {
        setRemovingId(null);
      }
    },
    [removeSuggestedStop]
  );

  return (
    <div
      className="
        rounded-lg border border-[#626F47]/20 bg-[#F9FAF5]
        p-6 shadow-sm flex flex-col min-h-0 overflow-hidden
        h-[calc(90dvh-90px)]
      "
    >
      {/* Header */}
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
        <svg
          className="h-5 w-5 text-[#626F47]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
        </svg>
        Planned Disc Golf Stops
      </h3>

      {isRoundTrip && (
        <p className="text-sm text-gray-600 mb-2">
          Round trip mode enabled – your stops will loop back to the start.
        </p>
      )}

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1">
        {Object.keys(groupedByDay).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <svg
              className="h-12 w-12 text-[#626F47]/40 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="font-medium">No stops planned yet</p>
            <p className="text-sm">Add a start and destination to see your trip here.</p>
          </div>
        ) : (
          Object.entries(groupedByDay).map(([day, stops]) => (
            <div key={day} className="mb-6 last:mb-0">
              <h4
                className="
                  sticky top-0 z-10 -mx-6 px-6 py-2
                  bg-[#F9FAF5]/90 supports-[backdrop-filter]:bg-[#F9FAF5]/70 backdrop-blur
                  text-base font-semibold text-gray-700 border-b border-[#626F47]/20
                "
              >
                Day {day}
              </h4>

              <ul className="mt-2 space-y-2">
                {stops.map((stop, index) => {
                  const isStart = index === 0 && !stop.isCourse;
                  const isEnd = index === stops.length - 1 && !stop.isCourse;
                  const isSuggested = !!stop.isCourse && !!stop.isSuggested;
                  const isCustomCourse = !!stop.isCourse && !stop.isSuggested;

                  return (
                    <li
                      key={stop.courseId ?? `${stop.name}-${index}`}
                      className="flex items-start justify-between gap-3 bg-white p-3 rounded border border-[#626F47]/10"
                    >
                      <div className="flex gap-3 min-w-0">
                        <div className="mt-1 text-[#626F47]" aria-hidden="true">
                          📍
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 flex flex-wrap items-center gap-2">
                            {stop.name}
                            {isStart && (
                              <span className="badge badge-sm bg-[#626F47]/10 text-[#626F47] border-[#626F47]/20">
                                Start
                              </span>
                            )}
                            {isSuggested && (
                              <span className="badge badge-sm bg-sky-100 text-sky-700 border-sky-200">
                                Suggested
                              </span>
                            )}
                            {isCustomCourse && (
                              <span className="badge badge-sm bg-amber-100 text-amber-700 border-amber-200">
                                Custom
                              </span>
                            )}
                            {isEnd && (
                              <span className="badge badge-sm bg-emerald-100 text-emerald-700 border-emerald-200">
                                End
                              </span>
                            )}
                          </p>

                          <div className="flex items-center flex-wrap gap-2 mt-2">
                            {isSuggested && (
                              <button
                                className="btn btn-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                onClick={() => handleRemove(stop.courseId)}
                                disabled={!stop.courseId || removingId === stop.courseId}
                                aria-label={`Remove ${stop.name}`}
                              >
                                {removingId === stop.courseId ? "Removing…" : "✕ Remove"}
                              </button>
                            )}
                            {(stop.isCourse && (stop.rating || stop.reviews)) && (
                              <p className="text-sm text-yellow-700">
                                {stop.rating ? `⭐ ${stop.rating}` : "No rating"}{" "}
                                {stop.reviews ? `(${stop.reviews} reviews)` : "(No reviews)"}
                              </p>
                            )}
                          </div>

                          {stop.address && (
                            <p className="text-sm text-gray-600 break-words">{stop.address}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Summary bar with Start Over hooked in */}
      <TripSummaryBar className="mt-4" onStartOver={resetPlanner} />
    </div>
  );
}
