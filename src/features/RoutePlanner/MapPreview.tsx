import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import type { Stop } from "../../types/PlannerTypes"

type Props = {
  route: Stop[] | null
}

export function MapPreview({ route }: Props) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)

  useEffect(() => {
    if (!route || route.length < 2) return

    const origin = route[0]
    const destination = route[route.length - 1]
    const waypoints = route.slice(1, route.length - 1).map((stop) => ({
      location: { lat: stop.lat, lng: stop.lng },
      stopover: true,
    }))

    const service = new google.maps.DirectionsService()
    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result)          
        } else {
          console.error('Failed to get directions:', status)
        }
      }
    )
  }, [route])

  const center = route?.[0] ?? { lat: 59.9139, lng: 10.7522 }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Route Preview</h3>
      <div className="h-[500px] rounded-lg overflow-hidden">
        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={7}>
          {route?.map((stop, idx) => (
            <Marker key={idx} position={{ lat: stop.lat, lng: stop.lng }} label={`${idx + 1}`} />
          ))}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </div>
  )
}
