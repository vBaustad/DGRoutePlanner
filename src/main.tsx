// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { PlannerProvider } from "./provider/PlannerProvider";
import { LoadScriptNext } from "@react-google-maps/api";
import { RoutePlannerProvider } from "./provider/RoutePlannerProvider";
import { CourseDiscoveryProvider } from "./provider/CourseDiscoveryProvider";
import { inject } from "@vercel/analytics";
import { BrowserRouter } from "react-router-dom";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (import.meta.env.PROD) {
  inject();
}


//const browserLang = (typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "en") || "en";
const browserRegion = (typeof navigator !== "undefined" ? navigator.language.split("-")[1]?.toLowerCase() : undefined) || undefined;


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {apiKey ? (
      <LoadScriptNext
        googleMapsApiKey={apiKey}
        libraries={["places", "geometry", "marker"]}
        language="en"
        region={browserRegion} 
        version="weekly"
      >
        <PlannerProvider>
          <RoutePlannerProvider>
            <CourseDiscoveryProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </CourseDiscoveryProvider>
          </RoutePlannerProvider>
        </PlannerProvider>
      </LoadScriptNext>
    ) : (
      <div style={{ padding: 16 }}>
        Missing <code>VITE_GOOGLE_MAPS_API_KEY</code>. Add it to <code>.env.local</code>.
      </div>
    )}
  </StrictMode>
);
