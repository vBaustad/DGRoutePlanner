// AdSlot.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

type Props = {
  slot: string;                   // your data-ad-slot
  className?: string;
  width?: number | string;        // e.g. 160
  height?: number | string;       // e.g. 600
  responsive?: boolean;           // auto format responsiveness
  test?: boolean;                 // set true in dev
};

export function AdSlot({
  slot,
  className,
  width = "100%",
  height = "auto",
  responsive = false,
  test = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ins = wrap.querySelector("ins.adsbygoogle") as HTMLElement | null;
    if (!ins) return;

    // If AdSense already initialized this node, it adds this attribute.
    if (ins.getAttribute("data-adsbygoogle-status") === "done") return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // swallow in dev/StrictMode
      console.debug("adsbygoogle push skipped", err);
    }
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width, height }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={responsive ? "auto" : undefined}
        data-full-width-responsive={responsive ? "true" : undefined}
        {...(test ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
