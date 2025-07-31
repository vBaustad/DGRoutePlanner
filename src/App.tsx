import { RoutePlanner } from "./components/route-planner"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
              <span className="text-xl">🥏</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Disc Golf Route Planner</h1>
              <p className="text-sm text-gray-600">Plan your perfect disc golf adventure</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with space for ads */}
<<<<<<< HEAD
      <main className="container mx-auto px-4 py-4">
=======
      <main className="container mx-auto px-4 py-8">
>>>>>>> 6e50f4ef4c33e0022ff226ca196761776a79f2cc
        <div className="mx-auto max-w-4xl">
          <RoutePlanner />
        </div>
      </main>
    </div>
  )
}
