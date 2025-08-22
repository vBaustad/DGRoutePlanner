// AdSlot.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

type Props = {
  slot: string;                   // your data-ad-slot
  className?: string;
  width?: number | string;        // for fixed-size units (e.g., 160)
  height?: number | string;       // for fixed-size units (e.g., 600)
  responsive?: boolean;           // true -> responsive (auto)
  test?: boolean;                 // true in dev
};

export function AdSlot({
  slot,
  className,
  width,
  height,
  responsive = false,
  test = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ins = wrap.querySelector("ins.adsbygoogle") as HTMLElement | null;
    if (!ins) return;

    // skip if already filled
    if (ins.getAttribute("data-adsbygoogle-status") === "done") return;

    // AdSense script must be present
    if (typeof window === "undefined" || !window.adsbygoogle) return;

    try {
      window.adsbygoogle.push({});
    } catch (err) {
      // swallow in dev / StrictMode double-mount
      // console.debug("adsbygoogle push skipped", err);
    }
  }, [slot, responsive, test]); // repush if these change

  // Style logic:
  // - responsive: let AdSense control size; display:block is enough
  // - fixed: set explicit width/height to match the created unit
  const style: React.CSSProperties = responsive
    ? { display: "block" }
    : { display: "block", ...(width ? { width } : {}), ...(height ? { height } : {}) };

  return (
    <div ref={wrapRef} className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
        data-ad-slot={slot}
        {...(responsive ? { "data-ad-format": "auto", "data-full-width-responsive": "true" } : {})}
        {...(test ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
