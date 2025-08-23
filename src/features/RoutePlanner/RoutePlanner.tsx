import { PlannerForm } from "./PlannerForm";
import { MapPreview } from "./MapPreview";
import { HelpSection } from "./HelpSection";
import { TripStopsOverview } from "./TripStopsOverview";
import { useRoutePlanner } from "../../hooks/useRoutePlanner";

export function RoutePlanner() {
  const { route } = useRoutePlanner();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_1fr]">
      {/* 1) HelpSection (always first) */}
      <section className="order-1 md:col-span-1 lg:col-span-1">
        <HelpSection />
      </section>

      {/* 2) PlannerForm (second) */}
      <section className="order-2 md:col-span-1 lg:col-span-1">
        <PlannerForm />
      </section>

      {/* 3) TripStopsOverview (third).
          On lg: occupies right column across both rows */}
      <section className="order-3 md:col-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2">
        <TripStopsOverview />
      </section>

      {/* 4) MapPreview (last).
          On md: spans both cols. On lg: bottom-left area */}
      <section className="order-4 md:col-span-2 lg:col-span-2 lg:row-start-2">
        <MapPreview route={route} />
      </section>
    </div>
  );
}
