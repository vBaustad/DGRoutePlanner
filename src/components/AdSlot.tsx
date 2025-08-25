import { useEffect, useRef } from "react";

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

type Props = {
  slot: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  responsive?: boolean;
  test?: boolean;
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
      console.debug("adsbygoogle push skipped", err);
    }
  }, [slot, responsive, test]); // repush if these change


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
