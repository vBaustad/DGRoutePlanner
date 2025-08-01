import { PlannerForm } from "./PlannerForm"
import { MapPreview } from "./MapPreview"
import { HelpSection } from "./HelpSection"
import { TripStopsOverview } from "./TripStopsOverview"

export function RoutePlanner() {
  return (
    <div className="grid lg:grid-cols-3 lg:grid-rows-[auto_1fr] gap-6">
      {/* Top Row */}
      <div className="lg:col-span-1">
        <div className="h-full">
          <HelpSection />
        </div>
      </div>

      <div className="lg:col-span-1">
          <PlannerForm />
      </div>

      {/* Bottom Row */}
      <div className="lg:col-span-2 lg:row-start-2">
        <div className="h-full">
          <MapPreview />
        </div>
      </div>

      <div className="lg:col-start-3 lg:row-start-1 lg:row-span-2">
        <div className="h-full">
          <TripStopsOverview />
        </div>
      </div>
    </div>
  )
}



