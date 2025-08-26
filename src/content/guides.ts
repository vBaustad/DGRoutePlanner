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
  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Export trips
  {
    slug: "export-trip-google-maps-gpx",
    title: "Export Your Trip to Google Maps & GPX",
    description:
      "Learn how to take your disc golf road trip with you: export routes to Google Maps, GPX for Garmin or mobile apps, and JSON for backups and spreadsheets. Includes limits, troubleshooting, and pro tips.",
    date: "2025-08-25",
    updated: "2025-08-25",
    category: "How-to",
    tags: ["Google Maps", "GPX", "Export", "Navigation"],
    cover: "/assets/BlogImages/table-with-map.jpg",
    body: `
One of the most exciting moments in planning a disc golf road trip is when your route finally comes together. You’ve set your start and end points, picked some promising courses, and now you want to take it with you. That’s where exporting comes in. This guide will walk you through exporting your trip into Google Maps, GPX files for navigation apps like Garmin, and JSON for archiving or sharing with other tools.

### Why exporting matters
The planner is where you design your trip — but the real world is where you live it. Exporting bridges that gap. Whether you want to navigate turn-by-turn in Google Maps, load the route into your Garmin for offline play, or save a machine-readable copy for later, there’s an export option that fits.

### Google Maps export
For most people, the simplest option is Google Maps. After planning your route, open the summary bar and choose **Share / Export → Copy Google Maps link**. Paste it into your browser, share it with friends, or open it directly on your phone. Google Maps supports live traffic, which means your estimated times will stay realistic. 

The catch? Google Maps limits you to 25 points per trip — that’s your start, end, plus 23 waypoints. Longer trips won’t fit in one link. If you’re over the limit, you’ll need to split your journey into multiple maps or export as GPX instead.

### GPX export
GPX files are the gold standard for serious road-trippers. They work offline, they’re supported by Garmin devices and dozens of mobile apps, and they aren’t bound by Google’s 25-point cap. To export, choose **Share / Export → Export GPX** and save the file. From there, you can import it into apps like OsmAnd, Locus Map, or Guru Maps.

Keep in mind that some apps will try to simplify or re-route your GPX file. Look for settings like “follow roads” or “snap to roads” to preserve the original plan. And always keep a backup in cloud storage for easy access.

### JSON export
Finally, there’s JSON. It’s not glamorous, but it’s incredibly useful. Exporting your trip as JSON gives you a raw list of stops, complete with names, coordinates, and trip totals. This is ideal if you want to build spreadsheets, archive past adventures, or integrate the data into your own tools.

### Putting it together
- Use **Maps** for quick sharing and live traffic.  
- Use **GPX** for reliability, offline navigation, and longer trips.  
- Use **JSON** for automation or archiving.

By choosing the right export format, you make sure your carefully planned disc golf adventure doesn’t just stay on the screen — it comes with you onto the road.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // GLOBAL HOW-TO
  {
    slug: "build-a-disc-golf-road-trip-anywhere",
    title: "Build a Disc Golf Road Trip Anywhere (Step by Step)",
    description:
      "A repeatable 5-step method for planning disc golf road trips in any country. Learn how to define your corridor, set detour windows, balance quality with pacing, and sanity-check timing.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Planning", "Itinerary", "Beginners", "Worldwide"],
    cover: "/assets/BlogImages/map-in-car.jpg",
    body: `
Planning a disc golf road trip doesn’t require insider knowledge or local contacts. What you need is a method — a simple framework that works just as well in Norway as it does in North Carolina. This guide walks you through a five-step process to build great trips anywhere in the world.

### Step 1: Draw your corridor
Start with the basics: your starting point and destination. This is your corridor — the backbone of your trip. Adding courses too early is a common mistake. By sketching your corridor first, you create a structure that keeps the trip realistic. If you’re doing a loop, set round-trip mode so you’ll end up where you started. For longer trips, divide your corridor into natural chunks for overnight stays.

### Step 2: Set your detour window
How far are you willing to wander off your main line for a good course? This is the most powerful setting in the planner. For most groups, 30 to 45 minutes is the sweet spot. It balances quality with convenience. Short on time? Keep detours at 15 to 25 minutes. Chasing a bucket-list course? Stretch to 45–60 minutes, but accept that you’ll play fewer total rounds.

### Step 3: Decide your pace
Disc golf trips aren’t just about miles — they’re about energy. New groups are usually happiest with one or two rounds per day. Experienced crews with long summer daylight might handle two or three. Tournament prep days are usually better with just one round plus practice. The goal is to finish each day tired but not exhausted, ready to enjoy the next.

### Step 4: Focus on quality
The planner ranks courses by a mix of ratings and review counts, weighted by detour time. That means a 4.4 course with 200 reviews may be a safer bet than a 4.9 course with only 8. But numbers aren’t everything. If you know your group prefers wooded technical courses or wide-open bombers, adjust accordingly. Removing a suggestion instantly replaces it with the next-ranked option.

### Step 5: Sanity-check your timing
Finally, reality check your plan. The summary bar gives you estimated drive times, but real-world days are longer. Add 15–20 minutes per course for parking and warm-up. Add half an hour for food and photos. If the summary says four hours of driving, your day will likely feel like six to eight. Front-load tough courses early while you have energy, and save shorter, easier layouts for the afternoon.

### The result
By combining a clear corridor, a realistic detour window, a sensible pace, and a focus on quality, you end up with days that don’t just look good on paper — they actually work in practice. That’s the secret to building disc golf trips anywhere: a method you can repeat in any country, with any group, and still have a great time.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Algorithm
  {
    slug: "how-dgrouteplanner-picks-courses",
    title: "How DGRoutePlanner Picks Courses (So You Can Pick Better)",
    description:
      "Understand how course suggestions are ranked: ratings, reviews, detour practicality, and routing. Learn how to tweak the algorithm for the exact trip you want.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Algorithm", "Ratings", "Detour", "Tips"],
    cover: "/assets/BlogImages/yellow-basket-in-forest.jpg",
    body: `
When the planner suggests a course, it’s not random. It’s the result of an algorithm designed to balance quality and practicality. Understanding how it works will help you make smarter choices.

### Quality comes first
We start with ratings, but we don’t just look at the number of stars. A course with 4.4 stars and 200 reviews often provides a more reliable picture than a 4.9 with only eight. The algorithm favors courses with consistent, widespread approval.

### Detour time matters
Next, we factor in how far off your main route a course is. Distance “as the crow flies” doesn’t mean much if the drive is down winding rural roads. We use Google’s routing to measure actual detour time, including road types and traffic where available.

### Review reliability
A glowing rating on a brand-new course can be misleading. That doesn’t mean new courses aren’t worth playing — but it does mean you should skim photos and comments before trusting the stars. Ratings are a signal, not the whole story.

### Your controls
The algorithm isn’t rigid. You can tweak it by adjusting your maximum detour, your courses-per-day setting, and by removing or replacing suggestions. Each change reshuffles the ranked pool to surface new options.

### When to override
Sometimes numbers lie. Seasonal closures, private rules, or local quirks can matter more than ratings. Use the planner’s suggestions as a strong starting point, then add your own judgment. That way, you’ll get the best of both worlds: the efficiency of automation plus the wisdom of experience.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Multi-day pacing
  {
    slug: "multi-day-disc-golf-trip-pacing",
    title: "Pacing a Multi-Day Disc Golf Trip (Without Burning Out)",
    description:
      "Learn how to structure your days on the road. Balance energy, travel time, and recovery so your trip feels fun from start to finish.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Pacing", "Time", "Daylight", "Fitness"],
    cover: "/assets/BlogImages/disc-golf-shot-night-time.jpg",
    body: `
The first day of a disc golf trip is often electric. Energy is high, throws feel sharp, and the excitement of the journey pushes you forward. But without smart pacing, that energy can burn out by day three. Here’s how to keep things fun all the way through.

### Balance your effort
Think of your energy like a budget. The 40/40/20 rule is a good starting point: spend 40% on your first course, when you’re freshest. Use another 40% on the middle round, where the real work happens. Save the final 20% for an easier finisher. If you’re only playing two courses, think of it as 60/40.

### Respect the clock
Driving times in the planner are accurate, but they don’t include all the friction of the day. Parking, warm-ups, and navigating trailheads all add minutes. Cities slow you down too. Add ten minutes for every one you drive through. And don’t forget meals and photo stops. If the planner says four hours of driving, expect six to eight hours door-to-door.

### Recover as you go
Alternate longer layouts with shorter ones. Stretch after each round. Drink water before you’re thirsty. These small habits add up, and they’re the difference between arriving at day four excited versus limping through.

### Weather is part of pacing
Wind, rain, and heat change the equation. In wind, look for wooded lines. In rain, favor short walk-ins and good drainage. On hot days, front-load your schedule before midday sun. Smart course choice is as much about energy as it is about design.

The key to pacing isn’t discipline — it’s foresight. Build days that your future self will thank you for.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Packing list
  {
    slug: "disc-golf-road-trip-packing-list",
    title: "Disc Golf Road-Trip Packing List (Everything You Actually Use)",
    description:
      "Pack smarter with this road-tested disc golf packing list. Covers essentials, weather kits, tools, car gear, and flight notes — all explained in plain English.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Packing", "Gear", "Vanlife", "Checklist"],
    cover: "/assets/BlogImages/disc-golf-bag.jpg",
    body: `
Packing for a disc golf road trip is a balancing act. Take too much and you’ll waste time digging through gear you never use. Take too little and you’ll regret it the first time it rains. After years of trips, this is the list that consistently works — and why.

### Start with the bag
Don’t overcomplicate it. Six to ten discs you truly trust are better than a trunk full of experiments. Stick with molds you know, so your throws feel consistent day after day. Add a mini, a marker, and a rule card so you’re covered for casual rounds or sanctioned play.

### Prepare for the weather
Weather will challenge you more than any course. A light rain shell, a hat, and a spare pair of socks go further than most people expect. If it’s wet, a garbage bag or seat cover can save your car. In cold climates, toss in a couple of hand warmers. They’re cheap, light, and worth their weight in gold on a frosty morning.

### Tools and quick fixes
You don’t need a workshop — just a few key items. A Sharpie, some duct tape flattened into a wallet-sized card, and a handful of zip ties can fix most small problems. A small multi-tool or knife covers the rest. First aid should be minimal but functional: something for blisters, scrapes, and headaches.

### Life in the car or van
Road trips are as much about the car as the courses. Mount your phone securely, carry extra cables, and keep a power bank handy. A headlamp or flashlight helps when rounds run long. And don’t underestimate the joy of a cooler with snacks — five minutes after the car is the best time to refuel.

### Flights and airports
Flying adds a layer of complexity. Pack discs in your carry-on with a towel around the rims. Tools and liquids go in checked luggage. It’s simple, but forgetting this can cause real headaches at security.

Packing well doesn’t just make your trip easier. It frees your mind to focus on what matters: playing great courses, seeing new places, and enjoying the adventure.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // COURSE LIST
  {
    slug: "worldwide-disc-golf-road-trip-ideas",
    title: "Worldwide Disc Golf Road-Trip Ideas (Build-Your-Own)",
    description:
      "Inspiration for disc golf adventures worldwide. Use these flexible trip templates — city-to-mountains, coastlines, weekend loops, family combos — and let the planner fill in the details.",
    date: "2025-08-25",
    category: "Course List",
    tags: ["Worldwide", "Ideas", "Templates", "Itinerary"],
    cover: "/assets/BlogImages/disc-golf-warning-sign.jpg",
    body: `
You don’t need a fixed bucket-list to dream up a great trip. What you need are patterns — repeatable structures you can adapt anywhere. Here are a few that work in almost any country.

### City to Mountains
Start in a major city where flights and rentals are easy. Play a warm-up round nearby, then head toward the mountains for a scenic mid-trip highlight. Detour 25–35 minutes for the best courses without wrecking the schedule.

### Coastal Drift
Follow a coastline and let the sea set the tone. Play the technical course at midday calm, then finish with something more relaxed. Windy days are inevitable — pick layouts that stay fun in gusts.

### Festival Sandwich
If your trip revolves around a concert, tournament, or event, frame it with courses on both sides. Keep detours short and parking easy, so the travel day doesn’t compete with the main attraction.

### Weekend Loop
Not every trip is epic. Two days, two or three courses, out-and-back. Play one set on the way out, another on the way back. Export per-day GPX files and you’ve got a loop you can repeat whenever the urge strikes.

### Friends and Family
Balance the trip for mixed groups. One premium course per day keeps the players happy. A short, beginner-friendly layout keeps newcomers engaged. Choose parks with bathrooms and nearby food for comfort.

These templates aren’t rigid itineraries. They’re flexible frameworks. Add the planner’s ranked courses and you’ll have a trip that feels designed for you, anywhere in the world.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // ITINERARY
  {
    slug: "oslo-bergen-3-day-disc-golf-road-trip",
    title: "Oslo → Bergen: A 3-Day Disc Golf Road Trip",
    description:
      "A balanced three-day Oslo to Bergen itinerary with great courses, iconic scenery, and realistic drive times. Includes daily pacing and export tips.",
    date: "2025-08-25",
    updated: "2025-08-25",
    category: "Itinerary",
    tags: ["Norway", "Road Trip", "Itinerary"],
    cover: "/assets/BlogImages/snowy-basket.jpg",
    body: `
Norway is famous for fjords and mountains, but it also has some excellent disc golf. This three-day plan from Oslo to Bergen balances scenery with play, giving you realistic drive times and memorable courses along the way.

### The trip in numbers
- Drive: 7–9 hours net  
- Pace: 2 courses per day  
- Best months: late spring to early autumn  
- Export: GPX for reliability, Maps for sharing  

### Day 1 — Oslo to Kongsberg
Begin in Oslo with a warm-up course close to the city. By midday, head toward Drammen for a more challenging round, then finish with something technical near Kongsberg. Spend the night in Kongsberg and prepare the next day’s exports.

### Day 2 — Kongsberg to Odda
Stop in Notodden to break up the morning drive. In the afternoon, the route toward Odda delivers some of the most scenic legs of the trip — allow time for photos. Play an elevation-heavy course before resting overnight in Odda.

### Day 3 — Odda to Bergen
Start with a shorter course near Voss to loosen up. In the afternoon, play a forgiving finisher as you approach Bergen. By evening, you’ll be celebrating in the city, GPX and Maps links shared with your group.

### Practical notes
Weather in Norway changes quickly. Pack layers, mark your discs, and always have a backup course in mind. Respect local rules, and leave each course cleaner than you found it. With the right balance, this trip combines the best of Norway’s landscapes with the joy of disc golf.
`
  },

  // ————————————————————————————————————————————————————————————————————————
  // HOW-TO: Weather
  {
    slug: "play-better-in-wind-and-rain",
    title: "Playing Better in Wind and Rain (Without Rebuilding Your Bag)",
    description:
      "Don’t cancel your round when the weather turns. Learn how to adapt to wind, rain, and heat with smart course choices, shot adjustments, and simple gear tweaks.",
    date: "2025-08-25",
    category: "How-to",
    tags: ["Weather", "Wind", "Rain", "Skills"],
    cover: "/assets/BlogImages/green-basket-fall-scenery.jpg",
    body: `
Bad weather doesn’t have to ruin your trip. With the right mindset and a few adjustments, wind and rain can add challenge instead of frustration.

### Choose your battleground
When it’s windy, wooded courses offer shelter and lower ceilings that reduce gust impact. In rain, favor layouts with good drainage, short walk-ins, and safe footing. On hot days, look for shaded tracks around midday and play open fields early or late.

### Adjust your throws
Wind changes everything. Into a headwind, throw more stable discs on lower lines. With a tailwind, choose understable plastic and give it height. Crosswinds demand aiming upwind and trusting the push. In rain, shorten your reachback and keep your tempo smooth — power is less important than control.

### Make small gear tweaks
You don’t need a whole new bag. Carry one grippy putter you trust when wet. Keep a cotton towel for grip and a microfiber for drying discs. Even a plastic bag or seat cover can make the ride between rounds far more comfortable.

Weather is just another variable — like elevation or trees. Plan for it, adjust to it, and your trip will keep rolling, rain or shine.
`
  }
];
