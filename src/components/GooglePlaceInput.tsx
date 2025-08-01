import { useEffect, useRef } from "react";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};


export function GooglePlaceInput({ id, value, onChange, placeholder, onKeyDown }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address"],
      types: ["geocode"],
    });

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      const address = place?.formatted_address || "";
      if (address) onChange(address);
    });

    return () => {
      if (listener) window.google.maps.event.removeListener(listener);
    };
  }, []);

  return (
    <input
      id={id}
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="input input-bordered w-full"
      autoComplete="off"
    />

  );
}
