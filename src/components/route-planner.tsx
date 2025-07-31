import { PlannerForm } from "../features/RoutePlanner/PlannerForm"
import { MapPreview } from "../features/RoutePlanner/MapPreview"
import { HelpSection } from "../features/RoutePlanner/HelpSection"

export function RoutePlanner() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <PlannerForm />
        </div>

        {/* Help Section - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <HelpSection />
        </div>
      </div>

      {/* Map Preview - Full width */}
      <MapPreview />
    </div>
  )
}
