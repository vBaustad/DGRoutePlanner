import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadGA, pageview } from "./ga";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (id) loadGA(id);
  }, [id]);

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
}
