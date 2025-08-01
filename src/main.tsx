import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlannerProvider } from './provider/PlannerProvider.tsx'
import { LoadScriptNext } from '@react-google-maps/api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadScriptNext
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
      language="en"
      region="no"
    >    
      <PlannerProvider>
        <App />
      </PlannerProvider>
    </LoadScriptNext>
  </StrictMode>
)
