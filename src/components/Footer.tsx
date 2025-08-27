import { Github, Linkedin, Mail, MapPin, HelpCircle, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const version = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";
  const sha = typeof __GIT_SHA__ !== "undefined" && __GIT_SHA__ ? __GIT_SHA__.slice(0, 7) : "local";

  const socials = [
    { label: "GitHub Repo", href: "https://github.com/vBaustad/DGRoutePlanner", Icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vBaustad/", Icon: Linkedin },
  ];

  const quickLinks = [
    { label: "How it works", href: "/guides" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "mailto:vebjorn.baustad@gmail.com?subject=DG%20Route%20Planner" },
  ];

  // Optional: basic JSON-LD. If you already add schema elsewhere, remove this.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Disc Golf Route Planner",
    url: "https://dgrouteplanner.com",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    description:
      "Plan disc golf road trips: enter start & destination, add stops, and get top-rated courses along your route.",
    author: {
      "@type": "Person",
      name: "Vebjørn Baustad",
      url: "https://github.com/vBaustad",
    },
    sameAs: socials.map((s) => s.href),
  };

  return (
    <footer className="bg-[#E6EED6] text-gray-800 mt-16 shadow-inner">
      <div className="container mx-auto px-4 py-12">
        {/* Top: 3-column content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <section aria-labelledby="footer-about">
            <h2 id="footer-about" className="text-lg font-semibold mb-3">
              About
            </h2>
            <p className="text-sm leading-6">
              <strong>Disc Golf Route Planner</strong> helps players find great courses{" "}
              <em>along their road trips</em>. Enter your start and destination, add optional
              stops, and we’ll suggest top-rated disc golf courses with controlled detours.
              Export your trip to your preferred navigation app.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Global coverage (where course data exists)
              </li>
              <li className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Free to use while in active development
              </li>
            </ul>
          </section>

          {/* Quick Links */}
          <nav aria-labelledby="footer-links">
            <h2 id="footer-links" className="text-lg font-semibold mb-3">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-2 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com/vBaustad/DGRoutePlanner/issues/new/choose"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                >
                  <ExternalLink className="h-4 w-4" />
                  Report an Issue
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vBaustad/DGRoutePlanner/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                >
                  <ExternalLink className="h-4 w-4" />
                  MIT License
                </a>
              </li>
            </ul>
          </nav>

          {/* FAQ */}
          <section aria-labelledby="footer-faq">
            <h2 id="footer-faq" className="text-lg font-semibold mb-3">
              FAQ
            </h2>

            <details className="group border border-gray-300 rounded-lg p-3 mb-2 bg-white/70">
              <summary className="cursor-pointer text-sm font-medium outline-none group-open:mb-2">
                How does it choose courses along my route?
              </summary>
              <p className="text-sm text-gray-700">
                We consider proximity to your path and ranking signals (rating, popularity) and
                cap detour time to keep the trip realistic.
              </p>
            </details>

            <details className="group border border-gray-300 rounded-lg p-3 mb-2 bg-white/70">
              <summary className="cursor-pointer text-sm font-medium outline-none group-open:mb-2">
                Can I add my own stops?
              </summary>
              <p className="text-sm text-gray-700">
                Yes. Add custom stops (cities, trailheads, friends’ places) and we’ll weave them
                into the route and suggestions.
              </p>
            </details>

            <details className="group border border-gray-300 rounded-lg p-3 bg-white/70">
              <summary className="cursor-pointer text-sm font-medium outline-none group-open:mb-2">
                Is Disc Golf Route Planner free?
              </summary>
              <p className="text-sm text-gray-700">
                It’s free while in active development. We may add optional Pro features later.
              </p>
            </details>
          </section>
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-300/60" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm text-gray-700">
              © {year} DG Route Planner · Built with ❤️ for disc golfers
            </div>
            <div className="text-xs text-gray-600">
              v{version} · {sha} ·{" "}
              <a href="/terms" className="hover:underline">
                Terms
              </a>{" "}
              ·{" "}
              <a href="/privacy" className="hover:underline">
                Privacy
              </a>
            </div>
          </div>


          <address className="not-italic text-sm text-gray-700 flex items-center gap-3">
            <a
              href="mailto:vebjorn.baustad@gmail.com?subject=DG%20Route%20Planner"
              className="inline-flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <span aria-hidden="true" className="text-gray-400">
              ·
            </span>
            <div className="flex items-center gap-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </address>
        </div>
      </div>

      {/* Optional JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </footer>
  );
}
