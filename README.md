# MicroPlanner | plan.ai

A focused micro-planning UI that turns a single task into timed steps, helps you run them in “focus mode,” and keeps lightweight progress locally in the browser.

## Features
- **AI step generation:** Calls Gemini (model `gemini-2.0-flash`) via `/api/plan` to produce 3–6 steps with minute estimates.
- **Focus mode timer:** Per-step countdown with restart/rewind logic, audible completion beeps (3 short + 1 long), and progress bars.
- **Manual editing:** Rename steps, adjust durations, add steps, mark complete.
- **Persistence:** Saves projects to `localStorage` (`modern_planner_v1`) so closing the tab keeps your list (per browser).
- **Polished UI/UX:** Animated dot loader, analog clock visualization, custom fonts/icons, off-white dotted backdrop, hover states.
- **Status icons:** Star variants indicate untouched / in-progress / done.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19.
- **Styling:** Tailwind CSS v4 (imported in `app/globals.css`) + component-level JSX styles.
- **Icons:** `lucide-react`, `react-icons` (Pi/Lu/Lia/Tb sets).
- **Fonts:** Plus Jakarta Sans, Orbitron, JetBrains Mono (clocks), Inter, Marker SD (subtitle), Inter ExtraLight for execution steps, Google-hosted and local.
- **AI:** `@google/generative-ai` (server-side); loader logic reused for page-level loading.

## Installation
```bash
npm install
# or yarn / pnpm / bun
```

## Running
```bash
# Dev
npm run dev

# Build & start
npm run build
npm run start
```

## Gemini / AI Config
- Set your key in `.env.local` (never commit it):
  ```
  GEMINI_API_KEY=your_key_here
  ```
- The API route `app/api/plan/route.js` reads `process.env.GEMINI_API_KEY`. If it’s missing, the route returns a 500 with an error message.
- **Mocking:** To run without calling Gemini, stub the response in `app/api/plan/route.js` (return static JSON) or set a flag and skip the SDK call.

## Customization
- **Loader text:** `ChromeLoader` accepts `label` (default “Analyzing”). Used in `app/loading.tsx` as “Loading.”
- **Sounds:** Step-complete tones are in `components/microplanner.jsx` (`playStepCompletionSound`); adjust frequencies/durations there.
- **Icons:** Star icons for steps are defined in the step list map; swap `PiStarFour*` if desired. Play button hover uses `PiPlayDuotone`.
- **Fonts:** Defined in `components/microplanner.jsx` (Marker SD, Inter ExtraLight, others) and `app/layout.tsx` (`Inter` base). Update URLs/weights as needed.
- **Backdrop:** Dotted off-white background lives in `components/microplanner.jsx` styles (`.bullet-page`).

## Key Files
- `app/page.tsx` – renders the planner.
- `app/layout.tsx` – global layout, base font, metadata (tab title “MicroPlanner | plan.ai”).
- `app/loading.tsx` – page-level loader using the dot animation.
- `app/api/plan/route.js` – Gemini step generation (server).
- `components/microplanner.jsx` – main UI, timers, loader, sounds, persistence.
- `app/globals.css` – Tailwind import, global font family.

## Notes
- Data is browser-local only; there’s no multi-user or sync.
- `.gitignore` already excludes `.env*` and `.local` files; keep keys in `.env.local`.
- If you ever committed a key, rotate it. Searching history for the literal key (or a fragment) returning nothing means you’re safe.***
