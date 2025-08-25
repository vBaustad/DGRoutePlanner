# 🥏 DGRoutePlanner

**DGRoutePlanner** helps disc golfers plan road trips by finding great courses along the way. Enter start/end, (optionally) add stops, set how many courses per day — and we’ll suggest top-rated courses within a sensible detour.

🔗 **Live planner:** https://dgrouteplanner.com/

---

## 🌟 Features

- 📍 **Interactive map** with an optimized driving route and custom pins
- 🧭 **Smart course suggestions** along your route with detour control
- ⭐ **Ratings & review counts** shown in the itinerary
- 🔁 **One-click replace**: remove a suggestion and we pop in another
- 🧰 **Advanced options** (toggle): set **Max Detour (minutes)**
- 🧱 **Scrollable itinerary panel** with sticky day headers
- 🧩 Custom stops (hotels, landmarks, etc.)
- 🔒 No login needed; all planning is client-side

> Planned: save/load trips locally, export/import (JSON/CSV), richer course details.

---

## 🧠 How it works (high level)

1. Geocodes start/end (+ any custom stops)
2. Builds a driving route with Google Directions
3. Scans along the route for nearby disc golf courses
4. Filters by **Max Detour** (driving time from the route)
5. Ranks by rating + number of reviews
6. Lets Google optimize the stop order

---

## 🛠 Tech Stack

- **React + TypeScript + Vite**
- **Tailwind CSS** (+ DaisyUI components)
- **Google Maps Platform** via `@react-google-maps/api`
- **Hosting:** Vercel
