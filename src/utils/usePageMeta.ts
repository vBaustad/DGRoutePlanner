import { useEffect } from "react";

function upsertMeta(attr: "name" | "property", key: string, content?: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta(opts: {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}) {
  const { title, description, image, noindex } = opts;
  useEffect(() => {
    if (title) document.title = title;
    if (description) upsertMeta("name", "description", description);
    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
    }
    if (noindex) upsertMeta("name", "robots", "noindex, nofollow");
  }, [title, description, image, noindex]);
}
