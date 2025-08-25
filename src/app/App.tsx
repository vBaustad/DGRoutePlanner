// App.tsx
import { Routes, Route } from "react-router-dom"; // (you can remove NavLink import now)
import { AdSlot } from "../components/AdSlot";
import { RoutePlanner } from "../features/RoutePlanner";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header"; // <-- add this
import GuidesIndex from "../pages/GuidesIndex";
import { GuidePage } from "../pages/GuidePage";

export default function App() {
  const isProd = import.meta.env.PROD;

  return (
    <div className="min-h-screen bg-base-300 relative flex flex-col">
      {isProd && (
        <div className="hidden lg:block fixed left-0 top-[100px] z-30">
          <AdSlot slot="LEFT_SLOT_ID" width={160} height={600} />
        </div>
      )}
      {isProd && (
        <div className="hidden lg:block fixed right-0 top-[100px] z-30">
          <AdSlot slot="RIGHT_SLOT_ID" width={160} height={600} />
        </div>
      )}
      
      <Header />

      <main className="relative z-10 container mx-auto px-4 py-4 flex-1 overflow-hidden">
        <div className="mx-auto max-w-8xl h-full">
          <Routes>
            <Route path="/" element={<RoutePlanner />} />
            <Route path="/guides" element={<GuidesIndex />} />
            <Route path="/guides/:slug" element={<GuidePage />} />
          </Routes>
        </div>

        {isProd && (
          <div className="block lg:hidden mt-6">
            <AdSlot slot="RESPONSIVE_MOBILE_SLOT_ID" width="100%" height={100} className="mx-auto" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
