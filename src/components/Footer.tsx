import { Github, Linkedin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  // Build metadata injected at build time (see vite.config.ts below)
  const version = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";
  const sha = typeof __GIT_SHA__ !== "undefined" && __GIT_SHA__ ? __GIT_SHA__.slice(0, 7) : "local";

  const links = [
    { label: "GitHub Repo", href: "https://github.com/vBaustad/DGRoutePlanner", Icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vBaustad/", Icon: Linkedin },
  ];

  return (
    <footer className="shadow-inner bg-[#E6EED6]">
      <div className="container mx-auto px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="text-sm text-gray-600">
            © {year} DG Route Planner · Built with ❤️ for disc golfers
          </div>

          {/* tiny info row */}
          <div className="text-xs text-gray-500">
            v{version} · {sha} ·{" "}
            <a className="hover:underline" href="https://github.com/vBaustad/DGRoutePlanner/issues/new/choose" target="_blank" rel="noopener noreferrer">
              Report issue
            </a>{" "}
            ·{" "}
            <a className="hover:underline" href="https://github.com/vBaustad/DGRoutePlanner/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
              MIT License
            </a>{" "}
            ·{" "}
            {/* <a className="hover:underline" href="mailto:vebjorn.baustad@gmail.com?subject=DG%20Route%20Planner" >
              Contact
            </a> */}
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {links.map(({ label, href, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white rounded"
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
