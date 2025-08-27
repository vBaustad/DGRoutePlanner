// App.tsx
import { Routes, Route } from "react-router-dom"; // (you can remove NavLink import now)
import { AdSlot } from "../components/AdSlot";
import { RoutePlanner } from "../features/RoutePlanner";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header"; // <-- add this
import GuidesIndex from "../pages/GuidesIndex";
import { GuidePage } from "../pages/GuidePage";
import FAQ from "../pages/FAQ";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import { CookieConsent } from "../providers/analytics/CookieConsent";

export default function App() {
  const isProd = import.meta.env.PROD;

  return (
    <div className="bg-gradient-to-b from-[#F9FAF5] to-[#E6EED6] min-h-screen relative flex flex-col">
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
            <Route path="/faq" element={<FAQ />}  />
            <Route path="/terms" element={<Terms />}  />
            <Route path="/privacy" element={<Privacy />}  />
          </Routes>
        </div>

        {isProd && (
          <div className="block lg:hidden mt-6">
            <AdSlot slot="RESPONSIVE_MOBILE_SLOT_ID" width="100%" height={100} className="mx-auto" />
          </div>
        )}
      </main>

      <Footer />
      <CookieConsent/>
    </div>
  );
}
