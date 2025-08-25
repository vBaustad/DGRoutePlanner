// src/content/guides.ts
export type GuideCategory = "Itinerary" | "How-to" | "Course List";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;           // ISO
  updated?: string;       // ISO
  category: GuideCategory;
  tags: string[];
  cover?: string;         // e.g. "/assets/guides/oslo-bergen.jpg"
  body: string;           // markdown
};

export const guides: Guide[] = [
  {
    slug: "export-trip-google-maps-gpx",
    title: "Export Your Trip to Google Maps & GPX",
    description:
      "Exactly how to export your planner route to Google Maps, GPX, and JSON — with waypoint limits, live-traffic time, and troubleshooting.",
    date: "2025-08-25",
    updated: "2025-08-25",
    category: "How-to",
    tags: ["Google Maps", "GPX", "Export", "Navigation"],
    // cover: "/assets/images/guides/export-hero.jpg",
    body: `
Planning a road trip is half the fun — taking it with you is the other half. This guide shows you **how to export your Disc Golf Route Planner trip** to **Google Maps**, **GPX** (for Garmin and mobile nav apps), and a simple **JSON** file you can save or share.

---

## TL;DR
- For **Google Maps**, use **Share → Copy Google Maps link**.  
- For **Garmin / mobile nav apps**, use **Share → Export GPX**.  
- If your trip has **more than 25 total points**, Google Maps will refuse it; **use GPX** or split the trip.

---

## Google Maps export (step-by-step)
1. Plan your route as normal (start, end, custom courses).  
2. Open the **summary bar** at the bottom.  
3. Click **Share** → **Copy Google Maps link**.  
4. Paste the link into your browser or send it to your travel buddies.

**Good to know**
- Google Maps caps a single route at **25 total points** (origin + destination + **23** waypoints).  
- We include your **departure time** so **ETA reflects live traffic** where available.
- If you reorder or add stops in Google Maps, it won’t sync back to the planner (one-way export).

### What if my trip is longer than 25 points?
You’ve got three options:
- **Use GPX** instead (no 25-point cap in the file itself).
- **Split the trip** into multiple Maps links (by day or region).
- **Group minor detours** into one stop in the planner.

---

## GPX export (Garmin & mobile)
GPX is a universal route/waypoint format used by **Garmin (BaseCamp/Explore)**, **OsmAnd**, **Locus Map**, **Guru Maps**, and others. It works **offline** once the file is on your device.

**Export**
1. Open the summary bar.  
2. Click **Share** → **Export GPX** to download.  
3. Import it into your navigation app.

**Tips**
- If your app asks “**route** vs **waypoints**,” pick **route** for turn-by-turn.  
- Some apps may **simplify** or **re-route** a GPX. Look for options like *“follow roads”* or *“snap to roads.”*
- Keep a backup in cloud storage for easy access on the road.

---

## JSON export (for spreadsheets/automation)
Use **Share → Download JSON** if you want a raw list of stops (name, lat/lng, optional place IDs) plus trip totals. Great for:
- Archiving trips
- Spreadsheets and custom tools
- Sharing a machine-readable plan

---

## Known limits & workarounds
- **Google Maps 25-point limit** → split by day or prefer GPX.  
- **Time mismatch** → opening the link later may use *current* traffic.  
- **Private/seasonal roads** → check app settings (avoid ferries/tolls/highways).  
- **Very long trips** → GPX is more portable and robust.

---

## FAQ

**Why does time change when I open the Google Maps link?**  
We export with your departure time; opening later can use *current* traffic.

**Can I edit the route after export?**  
Yes. Maps can reorder/drag; GPX apps can add waypoints or re-route.

**Best format to share?**  
**Maps link** for fast sharing; **GPX** for offline devices and repeatability.

**How do I keep things in sync?**  
Treat the planner as your **source of truth** and re-export after edits.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // GLOBAL HOW-TO: Build a disc golf road trip anywhere
  {
    slug: "build-a-disc-golf-road-trip-anywhere",
    title: "Build a Disc Golf Road Trip Anywhere (Step by Step)",
    description:
      "A repeatable method to plan great days in any country: corridor first, detour window, course quality, and realistic timing.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Planning", "Itinerary", "Beginners", "Worldwide"],
    // cover: "/assets/images/guides/plan-anywhere.jpg",
    body: `
You don’t need local knowledge to plan a **great** disc golf trip. Use this 5-step method anywhere in the world.

---

## 1) Draw your corridor
Enter your **start** and **end**. This creates a baseline driving line and a total time. Don’t add courses yet.

**Pro tip:** If you’re doing a loop, enable round-trip (same start and end) or pick a midpoint overnight.

---

## 2) Pick a detour window
Set **Max detour** to **30–45 minutes**. This is the sweet spot for finding **better-than-average** courses without turning your trip into a scavenger hunt.

- Short on time? Try 15–25 minutes.
- Chasing bucket-list courses? Go 45–60 minutes but reduce the total number of courses.

---

## 3) Choose a daily pace
Realistic pacing beats wish lists.

- New to road-trip golf → **1–2 courses/day**  
- Experienced group in summer daylight → **2–3 courses/day**  
- Tournament practice days → **1 course + putting/driving field**

Use the planner’s **courses per day** to get a sensible distribution.

---

## 4) Optimize for quality, then logistics
The planner surfaces candidates by **rating + review count** and keeps them **close to your line**.

A reliable order of preference:
1. High rating **and** lots of reviews  
2. Good access (parking, trailhead, not a maze of private roads)  
3. Fits your vibe (wooded vs open, elevation, length)

If a suggestion isn’t your style, **remove** it — the planner replaces it from a ranked pool.

---

## 5) Sanity-check timing
- The summary shows **total drive** and **total time** with live/typical traffic.  
- Add **buffer** for food, photos, and one wrong turn per city.  
- Front-load energy: toughest/longest course **before** afternoon slump.

---

## Day structure templates

### Ratings-first day (fast track)
- Morning: highest-rated within detour window  
- Lunch: near corridor  
- Afternoon: second-highest rated, **shorter** layout

### Scenic mix
- Morning: open, forgiving warm-up  
- Midday: wooded technical course (shade in heat)  
- Afternoon: short, fun finisher near your stay

---

## Export & share
- **Google Maps** for quick links  
- **GPX** for devices/offline  
- **JSON** for collaboration or spreadsheets

That’s it — apply this recipe in **any region**, and you’ll build days that play well and actually fit in real life.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: How selections work
  {
    slug: "how-dgrouteplanner-picks-courses",
    title: "How DGRoutePlanner Picks Courses (So You Can Pick Better)",
    description:
      "What the suggestions mean: ratings, review reliability, detour time, and Google routing — plus quick tweaks to get the exact trip you want.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Algorithm", "Ratings", "Detour", "Tips"],
    // cover: "/assets/images/guides/how-picks-courses.jpg",
    body: `
We favor **courses people actually love** — and that don’t wreck your timetable.

---

## The short version
- **Quality:** star rating with **diminishing returns** from review count (lots of 4.4s can beat a single 4.9).  
- **Practicality:** **detour time** from your corridor, not as-the-crow-flies.  
- **Logistics:** Google’s routing handles traffic patterns and road types.  
- **Cap:** We respect Google’s **23 waypoint** limit for one link.

---

## What you control
- **Max detour**: the biggest knob. Lower = faster days; higher = more “destination” courses.  
- **Courses per day**: controls pacing.  
- **Remove/Replace**: don’t hesitate — the pool is ranked.

---

## When ratings lie
- **Small sample size**: A 4.8 with 8 reviews can be flukey.  
- **Recency bias**: New courses may be under-reviewed but great — skim photos and comments.  
- **House rules**: Private hours, winter tees, or seasonal closures can affect playability more than stars.

---

## Quick tweak recipes
- Want **fewer cities**? Lower detour; the algorithm clings to the main corridor.  
- Want **premium stops**? Raise detour to 45–60 min and set 1–2 courses/day.  
- Want **family-friendly**? Prefer shorter, open layouts with parking and amenities in descriptions.

Use suggestions as a **strong starting point**, then nudge to taste.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Multi-day pacing
  {
    slug: "multi-day-disc-golf-trip-pacing",
    title: "Pacing a Multi-Day Disc Golf Trip (Without Burning Out)",
    description:
      "Time budgets, daylight math, and recovery — build days that feel great on day 1 and still fun on day 4.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Pacing", "Time", "Daylight", "Fitness"],
    // cover: "/assets/images/guides/pacing-hero.jpg",
    body: `
A perfect first day can ruin day three if you overdo it. Here’s a simple pacing framework that works.

---

## The 40/40/20 rule
- **40%** of your energy on the **first course** (freshest throws).  
- **40%** on the **middle** (the real workout).  
- **20%** on the **finisher** (choose a forgiving layout).

If you only play two courses, split **60/40**.

---

## Time math that holds up
- Add **15–20 minutes** per course for parking, warm-up, and navigation.  
- Add **10 minutes** per city you drive through.  
- Pad **30–45 minutes** per day for meals/photos.

If the summary bar says **3.8 h** driving, your actual day is probably **6–8 hours** door-to-door.

---

## Recovery beats hero days
- Alternate long and short layouts.  
- Stretch after the round, especially hamstrings and lower back.  
- Hydrate early; running dry kills accuracy.

---

## Weather pivots
- **Windy?** Prefer wooded lines.  
- **Rainy?** Favor good drainage and short walk-ins.  
- **Hot?** Aim for shade around midday.

A little planning here saves a lot of frustration later.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Packing list
  {
    slug: "disc-golf-road-trip-packing-list",
    title: "Disc Golf Road-Trip Packing List (Everything You Actually Use)",
    description:
      "A road-tested, compact packing list for cars, vans, and flights — including rain plans and quick repairs.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Packing", "Gear", "Vanlife", "Checklist"],
    // cover: "/assets/images/guides/packing-hero.jpg",
    body: `
You don’t need the pro shop in your trunk. Pack this and you’re covered.

---

## Bag essentials
- 6–10 discs you **trust** (don’t learn molds on the road)  
- Mini, marker, rule card  
- Towel (microfiber + small cotton “grip” towel)  
- Water 1–2 L per person

## Weather kit
- Light rain shell, hat, spare socks  
- Garbage bag or seat cover for wet rounds  
- Hand warmers in cold months

## Tools & fixes
- Sharpie, duct tape (flat-packed), zip ties  
- Small multi-tool or knife  
- First-aid basics (blister, scrape, headache)

## Car/van
- Phone mount + cable, power bank  
- Headlamp or small flashlight  
- Cooler/snacks; eat within 5 minutes of the car

## Flight-friendly notes
- Pack discs in a carry-on with a towel around the rims.  
- Check tools and liquids in the hold.

Print this list into your bag and you’ll stop over-packing forever.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // COURSE LIST: Worldwide trip ideas (non-region-specific)
  {
    slug: "worldwide-disc-golf-road-trip-ideas",
    title: "Worldwide Disc Golf Road-Trip Ideas (Build-Your-Own)",
    description:
      "Not a bucket-list of exact courses — a set of buildable, repeatable trip patterns you can drop into any country.",
    date: "2025-08-25",
    category: "Course List",
    tags: ["Worldwide", "Ideas", "Templates", "Itinerary"],
    // cover: "/assets/images/guides/world-ideas.jpg",
    body: `
You don’t need a fixed list to get inspired. Use these **trip patterns** as modules and let the planner fill in the exact courses near you.

---

## The City-to-Mountains
- Start in a major city (easy flights, rentals, food).  
- Two travel days, one **scenic** day in the middle.  
- Detour **25–35 min** to balance quality and drive time.

## The Coastal Drift
- Short hops along a coastline; favor **open, windy-proof** options.  
- Start early, play the technical course at **midday calm**, then a fun finisher.

## The Festival Sandwich
- Tournament or concert in the middle; one course **before**, one **after**.  
- Keep detours low (≤ 20 min) and pick **easy parking**.

## The Weekend Loop
- 2 days, 2–3 courses total.  
- Out-and-back with **different** courses each way.  
- Export one GPX per day; super repeatable.

## The Friends & Family
- One premium course per day + a **short beginner-friendly** layout.  
- Choose parks with bathrooms and nearby food.

Mix and match. Anywhere with roads and baskets can host one of these.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // ITINERARY: Oslo → Bergen (kept, expanded)
  {
    slug: "oslo-bergen-3-day-disc-golf-road-trip",
    title: "Oslo → Bergen: A 3-Day Disc Golf Road Trip",
    description:
      "A scenery-packed itinerary with realistic drive windows, pacing tips, and course-day structure. Export links included.",
    date: "2025-08-25",
    updated: "2025-08-25",
    category: "Itinerary",
    tags: ["Norway", "Road Trip", "Itinerary"],
    // cover: "/assets/images/guides/oslo-bergen-hero.jpg",
    body: `
This 3-day Oslo → Bergen plan balances **great courses** with **iconic scenery** and **realistic drive times**. Use it as a template and tailor the exact courses with the planner’s suggestions.

> ✨ **Pro tip**: Set **Max detour** to **30–45 min** to surface the best-rated courses without blowing up your schedule.

---

## Trip snapshot
- **Total drive**: ~7–9 h net (without detours)  
- **Pace**: 2 courses/day (adjust to your group)  
- **Good months**: late spring → early autumn  
- **Exports**: GPX for reliability, Maps for quick sharing

---

## Day 1 — Oslo → Drammen → Kongsberg
**Morning**: easy warm-up near Oslo (short detour).  
**Midday**: Drammen area course with good access.  
**Afternoon**: slightly more technical layout near Kongsberg.  
**Evening**: overnight Kongsberg; prep tomorrow’s exports.

## Day 2 — Kongsberg → Notodden → Odda
**Morning**: Notodden stop to break the drive.  
**Midday**: scenic leg toward Odda; photo breaks.  
**Afternoon**: elevation and views; hydrate and stretch.  
**Evening**: overnight Odda; check wind for Day 3.

## Day 3 — Odda → Voss → Bergen
**Morning**: shorter layout around Voss.  
**Afternoon**: forgiving finisher on the Bergen approach.  
**Evening**: celebrate, share Maps link and GPX with the group.

---

## Export this itinerary
Add **Oslo (start)** → your chosen **Drammen/Kongsberg/Notodden/Odda/Voss** stops → **Bergen (end)**.  
Use **Share** to export Maps or GPX (one GPX per day is tidy).

---

## Practical tips
Weather changes fast; pack layers. Mark discs; save a backup course per day. Respect local rules and leave it cleaner than you found it.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Weather play
  {
    slug: "play-better-in-wind-and-rain",
    title: "Playing Better in Wind and Rain (Without Rebuilding Your Bag)",
    description:
      "Shot selection, course choice, and tiny gear tweaks that make bad-weather rounds actually fun — and still on schedule.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Weather", "Wind", "Rain", "Skills"],
    // cover: "/assets/images/guides/weather-hero.jpg",
    body: `
When the forecast turns, don’t cancel — **pivot**.

---

## Choose the right course
- **Windy**: wooded lines and lower ceilings tame gusts.  
- **Rainy**: courses with good drainage, short walk-ins, and safe footing.  
- **Hot**: shade at midday; play open fields early or late.

---

## Simple shot adjustments
- Into wind: throw **more stable**, **lower**.  
- Tailwind: throw **less stable**, give it height.  
- Crosswind: aim on the **upwind** side and trust the push.  
- In rain: shorten reachback; smooth tempo beats power.

---

## Micro gear tweaks
- One **grippy** putter you trust when wet.  
- Small **cotton** towel for grip; microfiber for discs.  
- Plastic bag or seat cover for soggy rides.

The goal isn’t a perfect score — it’s a **good time** and a schedule that stays intact.
`
  }
];
