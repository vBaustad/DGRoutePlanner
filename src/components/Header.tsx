// src/components/Header.tsx
import { NavLink, Link } from "react-router-dom";
import logoUrl from "../assets/images/DGRoutePlannerCropped.png";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/guides", label: "Guides" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `btn btn-ghost btn-sm ${isActive ? "text-primary underline" : "text-base-content/80"}`;

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-b border-base-300">
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
              <div className="font-bold text-lg">Disc Golf Route Planner</div>
              <div className="text-xs text-base-content/70">Plan your perfect disc golf adventure</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu */}
          <div className="sm:hidden dropdown dropdown-end">
            <button className="btn btn-sm btn-outline" aria-label="Open menu">Menu</button>
            <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-44">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end}>{n.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
