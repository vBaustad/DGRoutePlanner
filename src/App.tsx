import { useEffect } from "react"
import { RoutePlanner } from "./features/RoutePlanner/RoutePlanner"

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function App() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.error("Adsense error", e)
    }
  }, [])

  return (
    <div className="min-h-screen bg-base-300 relative">
      {/* Sticky Left Ad */}
      <div className="hidden lg:block fixed left-0 top-[100px] z-30">
          <div className="border border-dashed border-red-500 bg-red-100/20 text-xs text-red-700 px-2 py-1 w-[160px] h-[600px] flex items-center justify-center">
            Left Ad (debug)
          </div>
        {/* <ins
          className="adsbygoogle"
          style={{ display: "block", width: "160px", height: "600px" }}
          data-ad-client="ca-pub-xxxxxxxxxxxx"
          data-ad-slot="LEFT_SLOT_ID"
        /> */}
      </div>

      {/* Sticky Right Ad */}
      <div className="hidden lg:block fixed right-0 top-[100px] z-30">
          <div className="border border-dashed border-blue-500 bg-blue-100/20 text-xs text-blue-700 px-2 py-1 w-[160px] h-[600px] flex items-center justify-center">
            Right Ad (debug)
          </div>
        {/* <ins
          className="adsbygoogle"
          style={{ display: "block", width: "160px", height: "600px" }}
          data-ad-client="ca-pub-xxxxxxxxxxxx"
          data-ad-slot="RIGHT_SLOT_ID"
        /> */}
      </div>

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

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-4">
        <div className="mx-auto max-w-8xl">
          <RoutePlanner />
        </div>
      </main>
    </div>
  )
}
