import { useEffect, useRef } from "react";

type SelectedPlace = {
  address: string;
  lat: number;
  lng: number;
};

type Props = {
  id: string;
  value: string;
  onChange: (val: SelectedPlace) => void;
  onInputChange?: (value: string) => void;
  regionCodes?: string[];
  locationBias?: { center: google.maps.LatLngLiteral; radius: number } | null;
};

// minimal types for the element + event
interface PlaceAutocompleteElement extends HTMLElement {
  value: string;
  getPlace(): google.maps.places.Place | null;
  includedRegionCodes?: string[];
  locationBias?: { center: google.maps.LatLngLiteral; radius: number } | null;
}
interface GmpSelectEvent extends Event {
  readonly placePrediction: { toPlace(): google.maps.places.Place };
}

export function GooglePlaceInput({
  id,
  value,
  onChange,
  onInputChange,
  regionCodes,
  locationBias = null,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pacRef = useRef<PlaceAutocompleteElement | null>(null);

  interface PlaceAutocompleteElementWithInput extends PlaceAutocompleteElement {
  Dg?: HTMLInputElement; // inner input exposed unofficially
}
  // create element + listeners once
  useEffect(() => {
    let selectHandler: (ev: Event) => void;
    let inputHandler: (ev: Event) => void;

    (async () => {
      await google.maps.importLibrary("places");

      if (!pacRef.current) {
        // ctor not in TS defs yet
        // @ts-expect-error test if this works
        pacRef.current = new google.maps.places.PlaceAutocompleteElement();
      }

      const el = pacRef.current! as PlaceAutocompleteElementWithInput;

      const host = hostRef.current!;
      if (!host.contains(el)) host.appendChild(el);

      el.className = "bg-white border border-gray-300 w-full";
      if (el.Dg) {
        el.Dg.setAttribute("placeholder", "Address");
        el.Dg.setAttribute("aria-label", "Address");
        el.Dg.style.color = "black";
      }

      // wire events
      selectHandler = async (e: Event) => {
        const { placePrediction } = e as GmpSelectEvent;
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ["displayName", "formattedAddress", "location"] });

        const loc = place.location as
          | google.maps.LatLng
          | google.maps.LatLngLiteral
          | null
          | undefined;

        const latLng =
          loc && typeof (loc as google.maps.LatLng).lat === "function"
            ? { lat: (loc as google.maps.LatLng).lat(), lng: (loc as google.maps.LatLng).lng() }
            : ((loc as google.maps.LatLngLiteral | null) ?? null);

        const displayName = place.displayName

        const address = displayName ?? place.formattedAddress ?? "";

        if (latLng && address) onChange({ address, lat: latLng.lat, lng: latLng.lng });
      };
      el.addEventListener("gmp-select", selectHandler);

      if (onInputChange) {
        inputHandler = () => onInputChange(el.value ?? "");
        el.addEventListener("input", inputHandler);
      }
    })();

    return () => {
      const el = pacRef.current;
      if (!el) return;
      if (selectHandler) el.removeEventListener("gmp-select", selectHandler);
      if (inputHandler) el.removeEventListener("input", inputHandler);
    };
  }, [onChange, onInputChange]);

  // keep props in sync with the element
  useEffect(() => {
    const el = pacRef.current;
    if (!el) return;
    el.includedRegionCodes = regionCodes;
    el.locationBias = locationBias;
    if (el.value !== value) el.value = value ?? "";
  }, [regionCodes, locationBias, value]);

  return <div id={id} ref={hostRef} style={{ display: "block", width: "100%" }} />;
}
