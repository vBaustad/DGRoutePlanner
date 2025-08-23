import { AdSlot } from "./components/AdSlot";
import { RoutePlanner } from "./features/RoutePlanner/RoutePlanner";
import logoUrl from "./assets/images/DGRoutePlannerCropped.png";

export default function App() {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-base-300 relative">
      {/* Sticky Left Ad (Desktop only) */}
      <div className="hidden lg:block fixed left-0 top-[100px] z-30">
        <AdSlot
          slot="LEFT_SLOT_ID"
          width={160}
          height={600}
          test={isDev}
        />
      </div>

      {/* Sticky Right Ad (Desktop only) */}
      <div className="hidden lg:block fixed right-0 top-[100px] z-30">
        <AdSlot
          slot="RIGHT_SLOT_ID"
          width={160}
          height={600}
          test={isDev}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="DGRoutePlanner Logo"
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Disc Golf Route Planner
              </h1>
              <p className="text-sm text-gray-600">
                Plan your perfect disc golf adventure
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 container mx-auto px-4 py-4">
        <div className="mx-auto max-w-8xl">
          <RoutePlanner />
        </div>

        {/* Mobile/Tablet Banner Ad */}
        <div className="block lg:hidden mt-6">
          <AdSlot
            slot="RESPONSIVE_MOBILE_SLOT_ID"
            width="100%"
            height={100}
            className="mx-auto"
            test={isDev}
          />
        </div>
      </main>
    </div>
  );
}
