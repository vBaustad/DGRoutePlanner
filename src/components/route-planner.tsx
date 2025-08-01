import { PlannerForm } from "../features/RoutePlanner/PlannerForm"
import { MapPreview } from "../features/RoutePlanner/MapPreview"
import { HelpSection } from "../features/RoutePlanner/HelpSection"
import { TripStopsOverview } from "../features/RoutePlanner/TripStopsOverview"

export function RoutePlanner() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-4">     

        {/* Help Section - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <HelpSection />
        </div>
        {/* Main Form - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <PlannerForm />
        </div>
        <div className="lg:col-span-1">
          <TripStopsOverview />
        </div>
      </div>

      {/* Map Preview - Full width */}
      <MapPreview />
    </div>
  )
}
