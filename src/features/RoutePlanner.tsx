import { PlannerForm } from "./PlannerForm";
import { MapPreview } from "./MapPreview";
import { HelpSection } from "./HelpSection";
import { TripStopsOverview } from "./TripStopsOverview";
import { useRoutePlanner } from "../hooks/useRoutePlanner";
import { usePageMeta } from "../utils/usePageMeta";
import { usePlanner } from "../hooks/usePlanner";

export function RoutePlanner() {
  const { route } = useRoutePlanner();
  const { form } = usePlanner();
  const { startLocation, endLocation } = form;

  const title =
    startLocation && endLocation
      ? `Disc Golf Route Planner — ${startLocation} to ${endLocation}`
      : "Disc Golf Route Planner — Find courses along your road trip";

  usePageMeta({
    title,
    description:
      "Plan disc golf road trips. Add stops and get top-rated course suggestions along your route with controlled detours.",
  });

return (
  <div
    className="
      h-full min-h-0
      grid grid-cols-1 gap-4
      md:grid-cols-2
      lg:grid-cols-3 lg:grid-rows-[auto_minmax(0,1fr)]
      overflow-hidden 
    "
  >
    {/* Help */}
    <section className="order-1 md:col-span-1 lg:col-span-1 h-full min-h-0">
      <div className="h-full rounded-lg bg-white shadow-sm border border-base-200">
        <HelpSection />
      </div>
    </section>

    {/* Planner form */}
    <section className="order-2 md:col-span-1 lg:col-span-1 h-full min-h-0">
      <div className="h-full rounded-lg bg-white shadow-sm border border-base-200">
        <PlannerForm />
      </div>
    </section>

    {/* Overview */}
    <section
      className="
        order-3 md:col-span-2
        lg:col-start-3 lg:row-start-1 lg:row-span-2
        h-full min-h-0 overflow-hidden flex flex-col
      "
    >
      <TripStopsOverview />
    </section>

    {/* Map */}
    <section
      className="
        order-4 md:col-span-2
        lg:col-span-2 lg:row-start-2
        h-full min-h-0"
    >
      <div className="rounded-xl bg-white shadow-sm border border-base-200 ring-1 ring-black/5 overflow-hidden h-full">
        <MapPreview route={route} />
      </div>
    </section>
  </div>
);

}
