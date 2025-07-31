import { PlannerForm } from "./PlannerForm"
import { MapPreview } from "./MapPreview"
import { HelpSection } from "./HelpSection"

export function RoutePlanner() {
  return (
    <div className="space-y-8">
<<<<<<< HEAD
      <div className="grid gap-4 items-stretch lg:grid-cols-3">
        
        <div className="lg:col-span-2 h-full">
          <PlannerForm />
        </div>

        <div className="lg:col-span-1 h-full">
=======
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <PlannerForm />
        </div>

        {/* Help Section - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
>>>>>>> 6e50f4ef4c33e0022ff226ca196761776a79f2cc
          <HelpSection />
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Map Preview - Full width */}
>>>>>>> 6e50f4ef4c33e0022ff226ca196761776a79f2cc
      <MapPreview />
    </div>
  )
}
