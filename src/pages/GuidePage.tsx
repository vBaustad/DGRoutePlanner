// src/pages/GuidePage.tsx
import { Link, useParams } from "react-router-dom";
import ReactMarkdown, { type Components } from "react-markdown";
import { guides } from "../content/guides";
import { usePageMeta } from "../components/usePageMeta";
import {
  Clock,
  User,
  Tag as TagIcon,
  Lightbulb,
  Info,
  AlertTriangle,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { useMemo } from "react";

type CodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & { inline?: boolean };

type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

function readingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function relativeTimeFromNow(iso: string): string {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const ms = new Date(iso).getTime() - Date.now();
  const minutes = Math.round(ms / 60000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(days, "day");
}

const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

/** Build a simple table-of-contents from markdown ## and ### headings */
function buildToc(body: string) {
  const items: { level: 2 | 3; text: string; id: string }[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    const id = slugify(text);
    items.push({ level, text, id });
  }
  return items;
}

export function GuidePage() {
  const { slug } = useParams();
  const guide = useMemo(() => guides.find((g) => g.slug === slug), [slug]);
  const canonical = `/guides/${slug ?? ""}`;

  usePageMeta({
    title: guide ? `${guide.title} | DGRoutePlanner` : "Guide | DGRoutePlanner",
    description: guide?.description,
    canonical,
    image: guide?.cover ?? "/og-cover.png",
    jsonLd: guide && {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.date,
      dateModified: guide.updated ?? guide.date,
      author: { "@type": "Person", name: "DGRoutePlanner" },
      url: canonical,
    },
    noindex: !guide,
  });

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl border border-base-300 bg-white p-6 shadow-sm">
          <p className="mb-3">
            <Link to="/guides" className="link">← Guides</Link>
          </p>
          <h1 className="text-xl font-semibold">Guide not found</h1>
        </div>
      </div>
    );
  }

  const mins = readingTime(guide.body);
  const timeAgo = relativeTimeFromNow(guide.updated ?? guide.date);
  const author = "DGRoutePlanner";
  const primaryTag = guide.tags?.[0];
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const toc = buildToc(guide.body);

  // ---------- markdown renderers ----------
  let isFirstParagraph = true;

  function Callout({
    tone,
    children,
  }: {
    tone: "tip" | "note" | "warn";
    children: React.ReactNode;
  }) {
    const tones = {
      tip: { Icon: Lightbulb, box: "bg-accent/10 border-accent/40", icon: "text-accent" },
      note: { Icon: Info, box: "bg-info/10 border-info/40", icon: "text-info" },
      warn: { Icon: AlertTriangle, box: "bg-warning/10 border-warning/40", icon: "text-warning" },
    } as const;
    const T = tones[tone];
    return (
      <div className={`my-4 rounded-md border ${T.box} p-3`}>
        <div className="flex items-start gap-2">
          <T.Icon className={`h-4 w-4 mt-0.5 ${T.icon}`} />
          <div className="text-base-content/90">{children}</div>
        </div>
      </div>
    );
  }

  const mdComponents: Components = {
    h2: (props) => {
      const text = String(props.children ?? "");
      return (
        <h2 id={slugify(text)} className="mt-10 mb-3 scroll-mt-24 text-2xl sm:text-3xl font-bold tracking-tight">
          {props.children}
        </h2>
      );
    },
    h3: (props) => {
      const text = String(props.children ?? "");
      return (
        <h3 id={slugify(text)} className="mt-6 mb-2 scroll-mt-24 text-xl font-semibold">
          {props.children}
        </h3>
      );
    },
    p: (props) => {
      const cls = isFirstParagraph
        ? "mt-4 mb-6 text-[18px] leading-8 text-base-content/85 first-letter:text-5xl first-letter:font-extrabold first-letter:mr-1.5 first-letter:float-left first-letter:leading-[0.85]"
        : "my-3 leading-7";
      isFirstParagraph = false;
      return <p className={cls} {...props} />;
    },
    ul: (props) => <ul className="list-disc pl-5 my-3 space-y-1" {...props} />,
    ol: (props) => <ol className="list-decimal pl-5 my-3 space-y-1" {...props} />,
    a: (props) => <a className="link link-primary" {...props} />,
    hr: (props) => <hr className="my-10 border-base-200" {...props} />,
    blockquote: (props) => {
      const raw = String(props.children ?? "");
      if (raw.startsWith("Tip:"))
        return (
          <Callout tone="tip">
            <span className="font-medium">Tip:</span>
            {raw.slice(4)}
          </Callout>
        );
      if (raw.startsWith("Note:"))
        return (
          <Callout tone="note">
            <span className="font-medium">Note:</span>
            {raw.slice(5)}
          </Callout>
        );
      if (raw.startsWith("Warning:"))
        return (
          <Callout tone="warn">
            <span className="font-medium">Warning:</span>
            {raw.slice(8)}
          </Callout>
        );
      return (
        <blockquote className="my-4 border-l-4 border-primary/30 pl-3 italic text-base-content/80" {...props} />
      );
    },
    code: ({ inline, ...props }: CodeProps) =>
      inline ? (
        <code className="px-1 py-0.5 rounded bg-base-200" {...props} />
      ) : (
        <code className="block p-3 rounded bg-base-200 overflow-x-auto text-sm" {...props} />
      ),
    img: (props: ImgProps) => {
      const { className, ...rest } = props;
      return (
        <img
          {...rest}
          loading="lazy"
          decoding="async"
          className={`rounded-xl border border-base-300 shadow-sm my-6 w-full object-cover ${className ?? ""}`}
        />
      );
    },
  };

  return (
    <div className="bg-white rounded-lg py-14 sm:py-20">
      {/* Outer width matches GuidesIndex */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title & meta block */}
        <header className="mx-auto max-w-4xl">
          <p className="mb-2 text-xs">
            <Link to="/guides" className="link">← Guides</Link>
          </p>

          <Link
            to={`/guides?cat=${encodeURIComponent(guide.category)}`}
            className="text-primary hover:text-base-content transition duration-300 ease-in-out text-sm"
          >
            {guide.category}
          </Link>

          <h1 className="mt-1 text-4xl font-bold text-base-content">{guide.title}</h1>

          <div className="py-4 text-sm text-base-content flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center">
              <Clock className="text-primary h-4 w-4" />
              <span className="ml-1">{timeAgo}</span>
            </span>

            <span className="flex items-center hover:text-primary">
              <User className="text-primary h-4 w-4" />
              <span className="ml-1">{author}</span>
            </span>

            {primaryTag && (
              <span className="flex items-center hover:text-primary">
                <TagIcon className="text-primary h-4 w-4" />
                <span className="ml-1">{primaryTag}</span>
              </span>
            )}

            <span className="opacity-50">•</span>
            <span className="text-base-content/70">
              {fmtDate(guide.updated ?? guide.date)} · {mins} min read
            </span>
          </div>

          {/* Share actions */}
          <div className="mt-2 mb-6 flex gap-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={async () => {
                try {
                  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
                  if (nav.share) {
                    await nav.share({ title: guide.title, text: guide.description, url: shareUrl });
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                  }
                } catch (err) {
                  console.warn("Share failed:", err);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-1" /> Share
            </button>

            <button
              className="btn btn-sm btn-outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                } catch (err) {
                  console.warn("Copy failed:", err);
                }
              }}
            >
              <LinkIcon className="h-4 w-4 mr-1" /> Copy link
            </button>
          </div>
        </header>

        {/* Optional cover */}
        {guide.cover && (
          <div className="mx-auto max-w-4xl">
            <img
              src={guide.cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full rounded-xl border border-base-300 shadow-sm object-cover"
            />
          </div>
        )}

        {/* Content area: wide main column + rail */}
        <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main column */}
          <div className="min-w-0">
            {/* Mobile Post navigation (only one nav overall) */}
            {toc.length > 0 && (
              <div className="mb-6 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm lg:hidden">
                <div className="text-sm font-semibold mb-2">Post navigation</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {toc.map((i) => (
                    <li key={i.id} className={i.level === 3 ? "ml-4" : ""}>
                      <a href={`#${i.id}`} className="link link-hover">
                        {i.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article body */}
            <div id="article-top" className="prose max-w-none">
              <ReactMarkdown components={mdComponents}>{guide.body}</ReactMarkdown>
            </div>

            {/* Tags footer */}
            {guide.tags?.length ? (
              <div className="mt-6 text-xs text-primary/90 font-medium space-x-1">
                {guide.tags.map((t) => (
                  <a
                    key={t}
                    href={`/guides?tag=${encodeURIComponent(t)}`}
                    className="hover:text-base-content transition duration-300 ease-in-out"
                  >
                    #{t}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right rail: sticky Post navigation on desktop */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60 mb-2">
                  Post navigation
                </div>
                <ul className="text-sm space-y-1">
                  {toc.map((i) => (
                    <li key={i.id} className={i.level === 3 ? "ml-3" : ""}>
                      <a href={`#${i.id}`} className="link link-hover">
                        {i.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
