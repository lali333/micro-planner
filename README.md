# MicroPlanner | plan.ai

A focused micro-planning UI that breaks complex tasks into timed steps, helps you run them in “focus mode” and keeps lightweight progress locally in the browser.

## 🚀 Features
- **AI step generation:** Calls Gemini (model `gemini-3-pro-preview`) via `/api/plan` to produce 3–10 steps with minute estimates.
- **Focus mode timer:** An immersive, full-screen timer featuring a per-step countdown clock with restart/rewind logic, audible completion beeps (3 short + 1 long), and progress bars.
- **Accordion editing:** Click any task to expand, rename steps, adjust durations, add steps, mark complete or drag & drop tasks to reorder task list.
- **Persistence:** Saves projects to `localStorage` (`modern_planner_v1`) so closing the tab keeps your list (per browser).
- **Polished UI/UX:** Animated dot loader, analog clock visualization, custom fonts/icons, off-white dotted backdrop, hover states.
- **Status icons:** Star variants indicate untouched / in-progress / done.

## 👩‍💻 Tech Stack
- **Framework:** Next.js 16 (App Router), React 19.
- **Styling:** Tailwind CSS v4 (imported in `app/globals.css`) + component-level JSX styles.
- **Icons:** `lucide-react`, `react-icons` (Pi/Lu/Lia/Tb sets).
- **Fonts:** Google Fonts (Plus Jakarta Sans, Orbitron, JetBrains Mono, Inter, Inter ExtraLight) and local (Marker SD from DaFont).
- **AI:** `@google/generative-ai` (server-side); loader logic reused for page-level loading.

## 🛠️ Installation
1) Clone the repo
```bash
git clone <your-repo-url>
cd micro-planner
```
2) Install dependencies
```bash
npm install
# or yarn / pnpm / bun
```
3) Run the dev server
```bash
npm run dev
```

## 🦾 Gemini / AI Config
- Set your key in `.env.local` (never commit it):
  ```
  GEMINI_API_KEY=your_key_here
  ```
- The API route `app/api/plan/route.js` reads `process.env.GEMINI_API_KEY`. If it’s missing, the route returns a 500 with an error message.
- **Mocking:** To run without calling Gemini, stub the response in `app/api/plan/route.js` (return static JSON) or set a flag and skip the SDK call.

## 🎨 Customization
- **Loader text:** `ChromeLoader` accepts `label` (default “Analyzing”). Used in `app/loading.tsx` as “Loading.”
- **Sounds:** Step-complete tones are in `components/microplanner.jsx` (`playStepCompletionSound`); adjust frequencies/durations there.
- **Icons:** Star icons for steps are defined in the step list map; swap `PiStarFour*` if desired. Play button hover uses `PiPlayDuotone`.
- **Fonts:** Defined in `components/microplanner.jsx` (Marker SD, Inter ExtraLight, others) and `app/layout.tsx` (`Inter` base). Update URLs/weights as needed.
- **Backdrop:** Dotted off-white background lives in `components/microplanner.jsx` styles (`.bullet-page`).

## 📂 Key Files
- `app/page.tsx` – renders the planner.
- `app/layout.tsx` – global layout, base font, metadata (tab title “MicroPlanner | plan.ai”).
- `app/loading.tsx` – page-level loader using the dot animation.
- `app/api/plan/route.js` – Gemini step generation (server).
- `components/microplanner.jsx` – main UI, timers, loader, sounds, persistence.
- `app/globals.css` – Tailwind import, global font family.

## 📝 Notes
- Data is browser-local only; there’s no multi-user or sync.
- `.gitignore` already excludes `.env*` and `.local` files; keep keys in `.env.local`.
- If you ever committed a key, rotate it. Searching history for the literal key (or a fragment) returning nothing means you’re safe.***

## License
MIT
