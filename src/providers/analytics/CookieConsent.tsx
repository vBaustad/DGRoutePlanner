import { useEffect, useState } from "react";
import { setConsent } from "./ga";

const STORAGE_KEY = "dg-consent"; // "granted" | "denied"

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem(STORAGE_KEY);
    if (!val) setVisible(true); // no decision yet
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "granted");
    setConsent(true);
    setVisible(false);
  }
  function reject() {
    localStorage.setItem(STORAGE_KEY, "denied");
    setConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-3xl m-4 rounded-xl border bg-white/95 shadow-lg p-4">
        <p className="text-sm text-gray-800">
          We use cookies for essential functionality and optional analytics (Google Analytics 4).
          Choose whether to allow analytics cookies. You can change this later in Privacy settings.
        </p>
        <div className="mt-3 flex gap-2 justify-end">
          <button
            className="px-3 py-1.5 rounded border text-sm"
            onClick={reject}
          >
            Reject
          </button>
          <button
            className="px-3 py-1.5 rounded bg-black text-white text-sm"
            onClick={accept}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
