import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";

type Stop = { name: string; lat: number; lng: number; isSuggested?: boolean };
type Props = { route: Stop[] | null };

export function MapPreview({ route }: Props) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [orderedStops, setOrderedStops] = useState<Stop[] | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // NEW: keep references to all AdvancedMarkerElements currently on the map
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // helper to clear all markers from the map
  const clearAllMarkers = () => {
    for (const m of markersRef.current) m.map = null;
    markersRef.current = [];
  };

  // When route is cleared or too short, also clear markers & state
  useEffect(() => {
    if (!route || route.length < 2) {
      clearAllMarkers();
      setDirections(null);
      setOrderedStops(route ?? null);
      setActiveIndex(null);
    }
  }, [route]);

  // Calculate directions, rebuild ordered stops
  useEffect(() => {
    if (!route || route.length < 2) return;

    // Before computing a new route, clear any leftover markers
    clearAllMarkers();

    const origin = route[0];
    const destination = route[route.length - 1];
    const wp = route.slice(1, -1).map(stop => ({
      location: { lat: stop.lat, lng: stop.lng },
      stopover: true,
    }));

    const svc = new google.maps.DirectionsService();
    svc.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: wp,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          const order = result.routes[0]?.waypoint_order ?? [];
          const mid = route.slice(1, -1);
          setOrderedStops([origin, ...order.map(i => mid[i]), destination]);
        } else {
          console.error("Failed to get directions:", status);
          setDirections(null);
          setOrderedStops(route); // fallback
        }
      }
    );
  }, [route]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const visibleStops = orderedStops ?? route ?? [];
  const center = route?.[0] ?? { lat: 59.9139, lng: 10.7522 };

   return (    
    <div className="h-full min-h-[320px]">
      <GoogleMap
        key={visibleStops.length === 0 ? "empty" : "with-route"} // optional hard reset key
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={route && route.length > 0 ? 8 : 7}
        onLoad={onMapLoad}
        options={{
          mapId: "55f3dc109db2f884843985ee",
          gestureHandling: "greedy",
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: { strokeColor: "#3B82F6", strokeWeight: 4 },
            }}
          />
        )}

        {/* Render markers in optimized order and register them */}
        {visibleStops.map((stop, idx) => {
          const isStart = idx === 0;
          const isEnd = idx === visibleStops.length - 1;
          const color = isStart ? "#10B981" : isEnd ? "#EF4444" : "#3B82F6";
          return (
            <Pin
              key={`${stop.name}-${idx}`}
              map={mapRef.current}
              position={{ lat: stop.lat, lng: stop.lng }}
              title={stop.name}
              label={`${idx + 1}`}
              bg={color}
              onCreate={marker => markersRef.current.push(marker)}
              onDestroy={marker => {
                // Remove one instance from our registry
                const i = markersRef.current.indexOf(marker);
                if (i >= 0) markersRef.current.splice(i, 1);
              }}
              onClick={() => setActiveIndex(idx)}
            />
          );
        })}

        {activeIndex !== null && visibleStops[activeIndex] && (
          <InfoWindow
            position={{
              lat: visibleStops[activeIndex].lat,
              lng: visibleStops[activeIndex].lng,
            }}
            onCloseClick={() => setActiveIndex(null)}
          >
            <div className="text-sm">
              <p className="font-semibold">
                {activeIndex === 0
                  ? "🏁 Start: "
                  : activeIndex === visibleStops.length - 1
                  ? "🏆 End: "
                  : `⛳ Stop ${activeIndex}: `}
                {visibleStops[activeIndex].name}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {visibleStops[activeIndex].lat.toFixed(4)}, {visibleStops[activeIndex].lng.toFixed(4)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>    
  );
}


function Pin({
  map,
  position,
  title,
  label,
  bg = "#3B82F6",
  glyphColor = "#FFFFFF",
  borderColor = "#FFFFFF",
  onClick,
  onCreate,
  onDestroy,
}: {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  title?: string;
  label?: string;
  bg?: string;
  glyphColor?: string;
  borderColor?: string;
  onClick?: () => void;
  onCreate?: (m: google.maps.marker.AdvancedMarkerElement) => void;
  onDestroy?: (m: google.maps.marker.AdvancedMarkerElement) => void;
}) {
  const pinOptions = useMemo(
    () => ({ background: bg, glyph: label, glyphColor, borderColor }),
    [bg, label, glyphColor, borderColor]
  );

  useEffect(() => {
    if (!map) return;

    let marker: google.maps.marker.AdvancedMarkerElement | null = null;
    let listener: google.maps.MapsEventListener | null = null;

    (async () => {
      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

      const pin = new PinElement(pinOptions);
      marker = new AdvancedMarkerElement({
        map,
        position,
        title,
        content: pin.element,
      });

      if (onCreate && marker) onCreate(marker);
      if (onClick && marker) listener = marker.addListener("click", () => onClick!());
    })();

    return () => {
      if (listener) listener.remove();
      if (marker) {
        marker.map = null;         // detach from map
        if (onDestroy) onDestroy(marker);
      }
    };
  }, [map, position, title, onClick, onCreate, onDestroy, pinOptions]);

  return null;
}