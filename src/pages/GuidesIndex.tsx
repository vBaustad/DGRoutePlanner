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
    <div className="bg-white rounded-lg py-14 sm:py-20">
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
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => {
            const href = `/guides/${post.slug}`;
            const cover = post.cover ?? "/og-cover.png";
            return (
              <article key={post.slug} className="flex flex-col items-start justify-between">
                {/* Cover */}
                <div className="relative w-full">
                  <img
                    alt=""
                    src={cover}
                    className="aspect-video w-full rounded-2xl bg-base-300 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-base-content/10" />
                </div>

                {/* Body */}
                <div className="flex max-w-xl grow flex-col justify-between">
                  <div className="mt-6 flex items-center gap-x-3 text-xs">
                    <time dateTime={post.date} className="text-base-content/60">
                      {fmtDate(post.updated ?? post.date)}
                    </time>
                    <span className="relative z-10 rounded-full bg-base-100 px-3 py-1.5 font-medium text-base-content/70 ring-1 ring-inset ring-base-content/10">
                      {post.category}
                    </span>
                  </div>

                  <div className="group relative grow">
                    <h2 className="mt-2 text-lg/6 font-semibold text-base-content group-hover:text-base-content/80">
                      <Link to={href}>
                        <span className="absolute inset-0" />
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
                            className="badge badge-ghost badge-xs"
                            title={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* “Author” strip – brand instead of a person */}
                  <div className="relative mt-6 flex items-center gap-x-3 justify-self-end">
                    <img
                      alt=""
                      src="/SiteLogo.png"
                      className="size-9 rounded-full bg-base-300 object-contain p-1"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="text-sm/6">
                      <p className="font-medium text-base-content">DGRoutePlanner</p>
                      <p className="text-base-content/60">Team</p>
                    </div>
                    <Link
                      to={href}
                      className="ml-auto btn btn-sm btn-primary"
                      aria-label={`Read ${post.title}`}
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
