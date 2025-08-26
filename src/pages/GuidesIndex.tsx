// src/pages/GuidesIndex.tsx
import { Link } from "react-router-dom";
import { guides, type Guide } from "../content/guides";
import { usePageMeta } from "../components/usePageMeta";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function GuidesIndex() {
  usePageMeta({
    title: "Guides & Road Trip Playbooks | DGRoutePlanner",
    description:
      "How-tos, itineraries, and course lists to plan smarter disc golf road trips anywhere.",
    canonical: "/guides",
    image: "/og-cover.png",
  });

  // newest first
  const posts: Guide[] = [...guides].sort(
    (a, b) => +new Date(b.updated ?? b.date) - +new Date(a.updated ?? a.date)
  );

  return (
    <div className="bg-gradient-to-b from-[#F9FAF5] to-[#E6EED6] rounded-lg py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Hero / heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance text-base-content sm:text-5xl">
            Guides & Road Trip Playbooks
          </h1>
          <p className="mt-3 text-base sm:text-lg text-base-content/70">
            Practical, skimmable articles: exports, detour strategy, itineraries, and
            “best courses” lists you can copy straight into the planner.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => {
            const href = `/guides/${post.slug}`;
            const cover = post.cover ?? "/og-cover.png";
            return (
              <article
                key={post.slug}
                className="
                  group flex flex-col rounded-2xl
                  bg-white/80 backdrop-blur-sm
                  border border-[#626F47]/15
                  shadow-sm hover:shadow-md transition-shadow
                  hover:-translate-y-0.5 will-change-transform
                  p-4 sm:p-5
                "
              >
                {/* Cover */}
                <div className="relative w-full">
                  <img
                    alt=""
                    src={cover}
                    className="aspect-video w-full rounded-xl object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
                </div>

                {/* Body */}
                <div className="flex max-w-xl grow flex-col justify-between">
                  <div className="mt-5 flex items-center gap-x-3 text-xs">
                    <time dateTime={post.date} className="text-base-content/60">
                      {fmtDate(post.updated ?? post.date)}
                    </time>
                    <span
                      className="
                        rounded-full px-3 py-1.5 font-medium
                        bg-[#626F47]/10 text-[#3E462C]
                        ring-1 ring-inset ring-[#626F47]/20
                      "
                    >
                      {post.category}
                    </span>
                  </div>

                  <div className="relative grow">
                    <h2 className="mt-2 text-lg/6 font-semibold text-base-content">
                      <Link to={href} className="after:absolute after:inset-0">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm/6 text-base-content/70">
                      {post.description}
                    </p>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="
                              badge badge-ghost badge-xs
                              border-[#626F47]/20 text-[#3E462C]
                            "
                            title={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Brand strip */}
                  <div className="mt-6 flex items-center gap-x-3">
                    <img
                      alt=""
                      src="/SiteLogo.png"
                      className="size-9 rounded-full bg-white object-contain p-1 ring-1 ring-black/5"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="text-sm/6">
                      <p className="font-medium text-base-content">DGRoutePlanner</p>
                      <p className="text-base-content/60">Team</p>
                    </div>

                    {/* Primary button – brand green */}
                    <Link
                      to={href}
                      aria-label={`Read ${post.title}`}
                      className="
                        ml-auto btn btn-sm
                        bg-[#626F47] hover:bg-[#4E5839]
                        text-white border-transparent
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#626F47]
                      "
                    >
                      Read
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
