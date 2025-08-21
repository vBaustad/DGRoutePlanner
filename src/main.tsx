import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { PlannerProvider } from './provider/PlannerProvider'
import { LoadScriptNext } from '@react-google-maps/api'
import { RoutePlannerProvider } from './provider/RoutePlannerProvider'
import { CourseDiscoveryProvider } from './provider/CourseDiscoveryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadScriptNext
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places", "geometry", "marker"]}
      language="en"
      region="no"
      version="beta"
    >
      <PlannerProvider>
        <RoutePlannerProvider>
          <CourseDiscoveryProvider>
            <App />
          </CourseDiscoveryProvider>
        </RoutePlannerProvider>
      </PlannerProvider>
    </LoadScriptNext>
  </StrictMode>
)
