import { useMemo, type JSX } from "react";
import { HelpCircle, Info, MapPin, Settings, Clock, Route, Gauge, Share2 } from "lucide-react";

/**
 * FAQ.tsx
 * - Accessible <details>/<summary>
 * - IDs for hash navigation (e.g. /faq#how-it-picks-courses)
 * - FAQPage JSON-LD for rich results
 * - Copy tuned for disc golf route planning keywords
 */

type QA = { id: string; q: string; a: JSX.Element; Icon?: React.ComponentType<any> };

const faqs: QA[] = [
  {
    id: "what-is-it",
    q: "What is Disc Golf Route Planner?",
    Icon: HelpCircle,
    a: (
      <>
        Disc Golf Route Planner is a free tool that helps you{" "}
        <strong>find disc golf courses along a road trip</strong>. Enter a start and destination,
        add optional stops, set how many courses per day you want, and we’ll suggest{" "}
        <em>top-rated</em> courses with controlled detours.
      </>
    ),
  },
  {
    id: "how-it-picks-courses",
    q: "How does it choose courses along my route?",
    Icon: Route,
    a: (
      <>
        We calculate your driving path and consider <strong>proximity to the route</strong>, course{" "}
        <strong>ratings/popularity</strong>, and your <strong>max detour time</strong>. Courses too
        far off the path are filtered out to keep the trip realistic.
      </>
    ),
  },
  {
    id: "data-sources",
    q: "Where does course data come from?",
    Icon: Info,
    a: (
      <>
        We combine <strong>public sources</strong> and user-curated lists. We’re exploring
        integrations with larger providers and will credit them appropriately (e.g.,{' '}
        <em>“Powered by …”</em>) if/when enabled. Some regions may be more complete than others.
      </>
    ),
  },
  {
    id: "custom-stops",
    q: "Can I add custom stops and pin specific courses?",
    Icon: MapPin,
    a: (
      <>
        Yes. Add <strong>custom stops</strong> (cities, trailheads, a friend’s place) and we’ll
        weave them into the route. You can also <strong>lock</strong> a suggested course so it stays
        in the plan while we replace others.
      </>
    ),
  },
  {
    id: "detours-speed",
    q: "How do detours and trip speed limits work?",
    Icon: Gauge,
    a: (
      <>
        You can set a <strong>max detour time</strong> (e.g., 20–40 minutes) and{" "}
        <strong>courses per day</strong>. We’ll respect those limits so the route stays playable and
        travel-friendly.
      </>
    ),
  },
  {
    id: "free-or-paid",
    q: "Is it free? Will there be Pro features?",
    Icon: HelpCircle,
    a: (
      <>
        It’s currently <strong>free while in active development</strong>. We may add optional Pro
        features later (e.g., offline export packs, multi-day optimizers, favorites, and
        collaboration) while keeping a generous free tier.
      </>
    ),
  },
  {
    id: "export-share",
    q: "Can I export the route to Google Maps or share it?",
    Icon: Share2,
    a: (
      <>
        Yes. You can <strong>export to your preferred navigation app</strong> (e.g., Google Maps)
        and share the link with friends. We’re also exploring GPX/KML download options.
      </>
    ),
  },
  {
    id: "accuracy-coverage",
    q: "How accurate is the coverage?",
    Icon: Info,
    a: (
      <>
        Coverage varies by country/region. If you notice missing or outdated courses, please{" "}
        <a
          className="underline"
          href="https://github.com/vBaustad/DGRoutePlanner/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
        >
          open an issue on GitHub
        </a>{" "}
        — community feedback helps us improve quickly.
      </>
    ),
  },
  {
    id: "settings-tips",
    q: "Any tips for better suggestions?",
    Icon: Settings,
    a: (
      <>
        Try these:
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Adjust <strong>max detour minutes</strong> to allow more/better candidates.</li>
          <li>Increase <strong>courses per day</strong> if you want more options.</li>
          <li>Add <strong>custom stops</strong> near areas you want to play.</li>
          <li>Remove a suggestion to get a replacement candidate.</li>
        </ul>
      </>
    ),
  },
  {
    id: "time-estimates",
    q: "How are drive times and days estimated?",
    Icon: Clock,
    a: (
      <>
        We estimate driving and play windows from your inputs and typical course durations. Real-world
        traffic, weather, and daylight can vary — always sanity-check your day plan.
      </>
    ),
  },
];

function QAItem({ id, q, a, Icon }: QA) {
  return (
    <details id={id} className="group border border-gray-300 rounded-lg p-4 bg-white/80 open:shadow-sm">
      <summary className="cursor-pointer outline-none text-base font-medium flex items-start gap-3">
        {Icon ? <Icon className="mt-0.5 h-5 w-5 text-gray-600" /> : null}
        <span>{q}</span>
      </summary>
      <div className="mt-3 text-sm text-gray-700 leading-6">{a}</div>
    </details>
  );
}

export default function FAQ() {
  // JSON-LD for FAQ rich results
  const jsonLd = useMemo(() => {
    const mainEntity = faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          // Strip JSX to a plain string fallback. For richer control, keep a parallel plaintext array.
          typeof f.a === "string"
            ? f.a
            : // crude fallback:
              (f.a as any)?.props?.children
              ? String(
                  Array.isArray((f.a as any).props.children)
                    ? (f.a as any).props.children.map((c: any) => (typeof c === "string" ? c : "")).join(" ")
                    : (f.a as any).props.children
                )
              : "See answer on page.",
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  }, []);

  return (
    <main className="min-h-screen bg-base-300">
      <section className="container mx-auto px-4 py-12">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-2 text-gray-700">
            Answers to common questions about planning disc golf road trips with DG Route Planner.
          </p>
        </header>

        {/* Quick jump links */}
        <nav aria-label="FAQ sections" className="mt-6">
          <ul className="flex flex-wrap gap-2 text-sm">
            {faqs.slice(0, 6).map((f) => (
              <li key={f.id}>
                <a href={`#${f.id}`} className="px-3 py-1 rounded-full bg-white border hover:bg-gray-50">
                  {f.q}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((item) => (
            <QAItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* JSON-LD for FAQ rich results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
