// src/hooks/usePageMeta.ts
import { useEffect } from "react";

type UsePageMetaOpts = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  jsonLd?: object;
};

function abs(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const base = import.meta.env.VITE_SITE_URL || window.location.origin;
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

function upsertMeta(attr: "name" | "property", key: string, content?: string) {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!content) { if (el?.dataset.dgrp === "seo") el.remove(); return; }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.dataset.dgrp = "seo";
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkCanonical(href?: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) { if (el?.dataset.dgrp === "seo") el.remove(); return; }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    el.dataset.dgrp = "seo";
    document.head.appendChild(el);
  }
  el.href = href!;
}

function upsertJsonLd(data?: object) {
  document
    .querySelectorAll('script[type="application/ld+json"][data-dgrp="seo"]')
    .forEach(n => n.remove());
  if (!data) return;
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.dataset.dgrp = "seo";
  el.text = JSON.stringify(data);
  document.head.appendChild(el);
}

export function usePageMeta(opts: UsePageMetaOpts) {
  const { title, description, image, canonical, noindex, jsonLd } = opts;

  useEffect(() => {
    if (title) document.title = title;

    // description
    upsertMeta("name", "description", description);

    // canonical (absolute)
    const canonicalAbs = abs(canonical ?? window.location.pathname);
    upsertLinkCanonical(canonicalAbs);

    // Open Graph (align URL with canonical)
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", abs(image));
    upsertMeta("property", "og:url", canonicalAbs);
    upsertMeta("property", "og:type", "article");

    // Twitter
    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", abs(image));

    // robots
    if (noindex) upsertMeta("name", "robots", "noindex, nofollow");
    else upsertMeta("name", "robots", undefined);

    // optional JSON-LD
    upsertJsonLd(jsonLd);
  }, [title, description, image, canonical, noindex, jsonLd]);
}
