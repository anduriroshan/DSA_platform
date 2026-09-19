---
name: category-icons
description: Homepage category-card icons (sorting/searching/structures/trees/graphs/dynamic-programming/arrays-hashing) are custom multi-color pixel marks in CategoryIcons.tsx, not emoji. Two related gaps were flagged but not fixed alongside this work.
metadata:
  type: project
---

Built 2026-09-19: the homepage's `CATEGORY_INFO` (in `frontend/src/pages/HomePage.tsx`) used to hold plain emoji (🫧 🔍 📦 🌳) for 4 categories and silently fell back to a generic 📁 for 3 categories that had no entry at all (`graphs`, `dynamic-programming`, `arrays-hashing` — these are real categories in `algorithmRegistry.ts`, just never given `CATEGORY_INFO` entries). The user's ask was explicit: stop using emoji, replace with custom marks in the same pixel-art design language, but keep them colorful the way emoji are (unlike the app's other two icon components, which are deliberately single-tone).

## Where it lives

`frontend/src/components/icons/CategoryIcons.tsx` — 7 named exports (`SortingIcon`, `SearchingIcon`, `DataStructuresIcon`, `TreesIcon`, `GraphsIcon`, `DynamicProgrammingIcon`, `ArraysHashingIcon`), each `({ size = 32 }: CategoryIconProps) => <svg>`, `viewBox="0 0 14 14"`, `shapeRendering="crispEdges"`, integer-only rect coordinates — same base technique as `LogoMark.tsx`/`ThemeMotif.tsx` (see [[logo_mark_review]]).

**The one deliberate deviation from those two sibling components: these are multi-color, not `currentColor`.** Each shape gets a hardcoded-per-shape `fill`, either a `var(--token)` reference (preferred, used whenever an existing token's color genuinely fit — see below) or a literal hex for colors with no token (brown trunk `#8b5a2b`/`#6b4423`, silver magnifying-glass ring `#9aa5b1`, a darker-green tree-shading tone `#00b359`). This is intentional and matches CSS-var usage already proven inside inline SVG in this codebase (`ThemeMotif.tsx` does the same `fill="var(--accent-primary)"` pattern) — these are representational/decorative fills, not semantic data-viz state, so there's no meaning-collision risk in the mix of var()s and literals.

`CATEGORY_INFO`'s `icon` field changed type from `string` to `ComponentType<CategoryIconProps>` — it now stores the component reference itself, rendered at the usage site (`<Icon />` inside the existing `.category-icon` span). The old `|| '📁'` string fallback became `Icon && <Icon />`; this is effectively dead code now since all 7 real registry categories (confirmed exhaustive via `grep category: algorithmRegistry.ts`) have an entry — there is no 8th category today that would hit the fallback.

## Design choices worth knowing before adding an 8th category

- **Sorting**: 4 ascending bars colored with the *actual* bar-state tokens (`--bar-sorted` green, `--bar-compare` yellow, `--bar-swap` coral, `--bar-merge` blue) — the icon previews the real `ArrayVisualizer` palette rather than inventing new hues.
- **Graphs**: deliberately NOT the same coordinates as `LogoMark.tsx`'s cardinal (N/S/E/W) hub-and-spoke, to avoid reading as "the brand logo, recolored." Uses a corner-node + diagonal-stub layout instead, with 4 corner nodes colored from `GraphAnimationFrame`'s actual `nodeStates` vocabulary (`--bar-default` unvisited, `--accent-coral` visiting, `--bar-sorted` visited, `--accent-yellow` frontier) plus a purple center hub.
- **Dynamic Programming**: a 3x3 grid whose color placement (yellow "read" cells feeding a coral "compute" cell, a purple "trace" cell, neutral elsewhere) mirrors `DPTableAnimationFrame`'s own `readCells`/`computeCell`/`tracePath` vocabulary.
- **Arrays & Hashing**: a row of cells (`--bar-default`) with one `--accent-coral` highlight plus tick marks underneath — kept deliberately distinct from the Sorting icon (uniform height + ticks + single highlight, vs. Sorting's full ascending-height gradient) so the two don't read as the same glyph at a glance.
- Titles/descriptions for the 3 new entries were newly authored (no prior copy existed to reuse): titles reuse `Sidebar.tsx`'s existing `CATEGORY_META` labels for consistency (`GRAPHS`, `DYNAMIC PROG.`, `ARRAYS & HASHING`) rather than inventing new phrasing.

## Two gaps flagged during this work, not fixed (out of scope at the time)

1. **`frontend/src/pages/HomePage.tsx`'s hero stat hardcodes `<div className="stat-value">04</div>` / `CATEGORIES`** — stale even before the icon work (the categories grid already rendered all 7 real registry categories going in; the count was already wrong, this task didn't cause it). Whoever touches the hero stats next should make this dynamic (`Object.keys(categories).length`) rather than hardcoded.
2. **`frontend/src/index.css`'s `.category-card.c-*` rules only define a `border-top` accent color for 4 categories** (`c-sorting`, `c-searching`, `c-data-structures`, `c-trees`, around line 1841) — `c-graphs`, `c-dynamic-programming`, `c-arrays-hashing` have no rule, so those 3 cards render with no colored top border even after getting real icons. Natural follow-up token choices: `--accent-purple` (graphs, matching the icon's hub), `--accent-coral` (dynamic-programming, matching the icon's compute-cell), `--accent-blue` (arrays-hashing).

See also [[project_dsa_platform]], [[logo_mark_review]].
