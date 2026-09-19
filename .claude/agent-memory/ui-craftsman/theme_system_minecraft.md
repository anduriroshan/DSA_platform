---
name: theme-system-minecraft
description: Day/night theme architecture after the Minecraft-style overhaul (2026-09-19) — token roles, motif, where state lives, and the console-chrome vs brand-chrome distinction that must be preserved in future theme edits.
metadata:
  type: project
---

Implemented 2026-09-19: light/dark went from "same palette, different luminance" to two genuinely distinct moods, following the user's explicit "Minecraft day/night" direction. Read this before touching any accent token or adding new chrome — the architecture has a non-obvious split that's easy to break by naive find/replace.

## Where theme state lives

Moved from local `App.tsx` `useState` into `useVisualizerStore.ts` (`theme: 'light'|'dark'`, `toggleTheme()`, `setTheme()`). Reasons: (1) the new `ThemeMotif` component needs to read theme without prop drilling, and more decorative/onboarding components are likely to follow; (2) the store already owns other UI-facing persisted state (`vizPanelOpen`, `codeEditorOpen`) with the identical `read*()` + `localStorage` + module-load-apply pattern, so this was consistent, not novel.

`localStorage` key stayed `dsaq.theme` (unchanged) so existing users' saved preference carries over. The `data-theme` attribute is applied **inside the store module**, both at module load (`applyThemeAttr(initialTheme)` runs synchronously when the store file is imported, before first paint — avoids FOUC) and inside `toggleTheme`/`setTheme`. `App.tsx` now just reads `theme`/`toggleTheme` via selectors and passes them to `Navbar` — it does no theme logic itself anymore.

## The critical distinction: brand accent vs console-chrome accent

This is the part most likely to get broken by a future "just swap the color" edit:

- **`--accent-primary` / `--accent-primary-dim`** — THE color that swaps per theme (night: `#00d4d4`/`#00a8a8`, the original neon cyan, unchanged; day: `#a84e00`/`#7a3600`, a contrast-checked terracotta). Used for brand/mood chrome that sits on the **theme-adaptive** backgrounds (`--bg-base`/`--bg-card`/`--bg-elevated`): navbar brand mark, hero title accent + shadow, breadcrumb separator, `.btn-primary`, sidebar-adjacent learn/callout accents, category-card hover, footer is NOT in this list (see below).
- **`--accent-cyan` / `--accent-cyan-dim`** — a **constant** `#00d4d4`/`#00a8a8` in BOTH themes, restored as an independent token (not an alias). Used for everything living on the platform's "console chrome" — surfaces that stay dark regardless of theme: sidebar, pseudocode/code-editor panels, output console, viz-panel header/step-chip, playback progress-bar/speed-slider (their tracks are hardcoded `#2a3050`), the footer (`--bg-dark` doesn't flip), and SVG badge text in Heap/Graph visualizers (index badge, weight/distance badges — these sit on `--bg-darker` inside the canvas). **Do not retint this token** — it would make day-mode text unreadable against surfaces that were never meant to lighten.
- **`--text-on-primary`** — text placed on an `--accent-primary` FILL (buttons, active badges): white in day (terracotta fill needs light text), navy in night (bright cyan fill needs dark text, matching the original `--text-on-accent` value). Any new `.btn-primary`-style fill must pair with this, not `--text-on-accent`.
- **`--accent-yellow/coral/green/purple/blue`** — the data-viz vocabulary (compare/swap/sorted/pivot/merge, and their Tree/Heap/Graph/DP-table equivalents). Deliberately **hue-constant across both themes** — retinting these would make "yellow = comparing" mean something different depending on theme, and would desync from the many hardcoded `rgba(r,g,b,0.2-ish)` translucent-fill companions scattered across `GraphVisualizer.tsx`/`HeapVisualizer.tsx`/`index.css`'s `.dp-cell.*` rules (those rgba values are hand-matched to these exact hex values and don't reference the token, so retinting the token without updating every rgba companion would visibly desync stroke vs fill).
- **`--status-good/warn/bad/info`** — a plain-TEXT-safe tier (dark, saturated colors in light theme; aliased straight to the bright accent-* in dark theme) for places where a semantic color is used as bare text on a card, not as an SVG fill-with-ink-border: `.learn-stat-value.*`, `.ll-arrow.backward`, `.ll-prev`. The bright `accent-yellow` etc. have contrast as low as ~1.6–3:1 as plain text on a light card — fine for a stroked/bordered SVG shape, not fine for a sentence of text. This also fixed a **pre-existing dark-mode bug**: `.learn-stat-value.good/warn` used hardcoded `#008844`/`#aa6600` (tuned only for a light card), which had ~3.1:1 contrast against the dark-theme card — now theme-aware.

**Rule of thumb for any future accent edit:** before touching `--accent-primary` or `--accent-cyan`, check whether the selector's actual rendered background is one of `--bg-base/--bg-card/--bg-elevated` (adaptive → `--accent-primary` is correct) or `--bg-dark/--bg-darker/--bg-darkest`/`--ink`/a hardcoded `#2a3050` (always-dark → `--accent-cyan` is correct). Getting this backwards is exactly the bug this overhaul fixed (day-mode terracotta text on a near-black console panel, ~2.3–3.5:1 contrast).

## Structural "default/idle" state — decoupled from brand color

`TreeVisualizer`, `HeapVisualizer`, `GraphVisualizer` previously used `var(--accent-cyan)` for the "unvisited/default" node stroke and `var(--text-tertiary)` (= `--ink-light`) for idle edge/link strokes. Both changed:
- Default node stroke → `var(--bar-default)` (already a theme-aware neutral slate-blue token used by `ArrayVisualizer`'s unsorted bars — reused here for consistency, no new token).
- Idle edge/link stroke → `var(--ink-muted)` (better contrast in both themes than `--ink-light`: ~4.2–5.4:1 vs ~2.8:1 against `--bg-elevated`).

This was necessary because the old cyan-based default would have inherited whatever `--accent-cyan`/`--accent-primary` became per theme, risking a default state visually colliding with an actual comparison/traversal state. Any future new visualizer's "default/unvisited" styling should follow the same pattern — reuse `--bar-default` / `--ink-muted`, don't invent a new neutral, and don't reuse a brand accent for it.

## Signature motif

- **`ThemeMotif.tsx`** (`frontend/src/components/layout/ThemeMotif.tsx`): small inline SVG, pixel-grid `<rect>`s (`shapeRendering="crispEdges"`, no images/blur), sun (day) or crescent moon + stars (night). Rendered inside the navbar's theme-toggle button itself (`Navbar.tsx`), replacing the old unicode ☀/◐ glyph. Takes a `theme` prop — no store dependency of its own, stays a pure presentational component.
- **`--world-motif`** CSS var: a handful of hard-edged (0%→100% same-stop, no blur) radial-gradient "stars" + a faint cyan glow for night; a soft two-gradient terracotta sun-glow wash for day. Applied via `background-image` (paired with explicit `background-color`, since `.navbar` previously used the `background:` shorthand which would've clobbered it) to `.navbar` and `.hero-section` only — deliberately not applied to `.visualizer-page` (mostly covered by opaque panels, low payoff) or to the always-dark console chrome (would visually clash with the "constant" cyan identity there).
- Twinkle/pulse animation (`.theme-motif-twinkle`) uses `steps(2, jump-none)`, matching the pixel system's snap-not-ease transition philosophy, and is disabled under `prefers-reduced-motion: reduce` (added to the existing reduced-motion media query rather than a new one).

## Verification method (no live renderer available)

The dev environment's `vite`/`npm run build` fails with a pre-existing, unrelated error (`Cannot find native binding '@rolldown/binding-win32-x64-msvc'` — a known npm optional-dependencies bug, not caused by this work; `frontend/package-lock.json` was already showing as modified before this session started). Could not screenshot light/dark/mobile as the quality checklist normally expects. Compensated with: `tsc --noEmit` (clean), a brace-balance script over `index.css`, and hand-computed WCAG contrast ratios (relative-luminance formula) for every text/fill pairing touched, cross-checked against every selector's *actual* rendered background by tracing the CSS cascade manually. If this environment issue is ever fixed, a real visual pass across both themes + 600px/900px breakpoints is still worth doing as a follow-up — treat the contrast math as a strong static guarantee, not a substitute for eyes on the actual render.

See also [[project_dsa_platform]].
