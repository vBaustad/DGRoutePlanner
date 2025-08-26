import { NavLink, Link } from "react-router-dom";
import logoUrl from "../assets/images/DGRoutePlannerCropped.png";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/guides", label: "Guides" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors
   ${isActive
     ? "text-[#626F47] border-b-2 border-[#626F47]"
     : "text-base-content/80 hover:text-base-content"
   }`;

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#F9FAF5]/95 backdrop-blur border-b border-[#626F47]/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="DGRoutePlanner"
              className="h-10 w-10 object-contain rounded"
              width={40}
              height={40}
              decoding="async"
            />
            <div className="leading-tight">
              <div className="font-bold text-lg text-[#3E462C]">
                Disc Golf Route Planner
              </div>
              <div className="text-xs text-base-content/70">
                Plan your perfect disc golf adventure
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu */}
          <div className="sm:hidden dropdown dropdown-end">
            <button
              className="btn btn-sm btn-outline"
              aria-label="Open menu"
            >
              Menu
            </button>
            <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-44">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      isActive ? "text-[#626F47] font-semibold" : ""
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
