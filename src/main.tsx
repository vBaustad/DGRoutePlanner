import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { PlannerProvider } from './provider/PlannerProvider'
import { LoadScriptNext } from '@react-google-maps/api'
import { RoutePlannerProvider } from './provider/RoutePlannerProvider'
import { CourseDiscoveryProvider } from './provider/CourseDiscoveryProvider'
import { inject } from '@vercel/analytics'

// main.tsx
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (import.meta.env.PROD) {
  inject()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {apiKey ? (
      <LoadScriptNext
        googleMapsApiKey={apiKey}
        libraries={["places", "geometry", "marker"]}
        language="en"
        region="no"
        version="weekly"   // prefer stable over "beta"
      >
        <PlannerProvider>
          <RoutePlannerProvider>
            <CourseDiscoveryProvider>
              <App />
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
