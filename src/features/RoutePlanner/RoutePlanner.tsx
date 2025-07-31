import { PlannerForm } from "./PlannerForm"
import { MapPreview } from "./MapPreview"
import { HelpSection } from "./HelpSection"

export function RoutePlanner() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 items-stretch lg:grid-cols-3">
        
        <div className="lg:col-span-2 h-full">
          <PlannerForm />
        </div>

        <div className="lg:col-span-1 h-full">
          <HelpSection />
        </div>
      </div>

      <MapPreview />
    </div>
  )
}
