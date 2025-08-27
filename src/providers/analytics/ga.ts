let loaded = false;

export function loadGA(measurementId: string) {
  if (loaded || !measurementId) return;
  // gtag.js
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);

  // dataLayer + base init (with default denied consent)
  const s2 = document.createElement("script");
  s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    // Consent Mode v2 defaults (deny until user consents)
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied'
    });
    gtag('js', new Date());
    gtag('config', '${measurementId}', { anonymize_ip: true });
  `;
  document.head.appendChild(s2);
  loaded = true;
}

export function setConsent(granted: boolean) {
  // Toggle Consent Mode v2
  // https://developers.google.com/tag-platform/security/concepts/consent
  window.gtag?.('consent', 'update', {
    'ad_storage': granted ? 'granted' : 'denied',
    'ad_user_data': granted ? 'granted' : 'denied',
    'ad_personalization': granted ? 'granted' : 'denied',
    'analytics_storage': granted ? 'granted' : 'denied'
  });
}

export function pageview(path: string) {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || !window.gtag) return;
  window.gtag('config', id, { page_path: path });
}

// Type-safe global
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}
