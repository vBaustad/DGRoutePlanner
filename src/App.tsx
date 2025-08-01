import { RoutePlanner } from "./components/route-planner"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">            
              <img
                src="/src/assets/images/DGRoutePlannerCropped.png"
                alt="DGRoutePlanner Logo"
                className="h-14 w-14 object-contain"
              />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Disc Golf Route Planner</h1>
              <p className="text-sm text-gray-600">Plan your perfect disc golf adventure</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with space for ads */}
      <main className="container mx-auto px-4 py-4">
        <div className="mx-auto max-w-8xl">
          <RoutePlanner />
        </div>
      </main>
    </div>
  )
}
