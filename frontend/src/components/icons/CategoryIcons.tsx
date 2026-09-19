// Homepage category-card icon marks. Same hard-edged pixel-grid technique as
// LogoMark.tsx / ThemeMotif.tsx (14x14 viewBox, integer-only rects,
// shapeRendering="crispEdges", no blur/anti-aliased curves) — but unlike
// those two (deliberately single-tone `currentColor`), these are
// deliberately MULTI-COLOR and representational, standing in for what used
// to be plain emoji (🫧 🔍 📦 🌳 📁) on the homepage's category cards.
// Colors reuse existing data-viz tokens where one genuinely fits the shape
// (e.g. bar-state colors for the sorting bars, graph node-state colors for
// the graph cluster); a few hardcoded hex values are used for colors with
// no existing token (brown trunk, silver ring) since these are decorative/
// representational marks, not semantic state indicators — no meaning-
// collision risk in picking whatever reads best.

export interface CategoryIconProps {
  size?: number;
}

// Sorting — ascending bars, colored with the same bar-state vocabulary the
// ArrayVisualizer uses mid-sort (sorted green / compare yellow / swap coral
// / merge blue) so the icon previews the real visualization.
export function SortingIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="1" y="11" width="2" height="3" fill="var(--bar-sorted)" />
      <rect x="4" y="8" width="2" height="6" fill="var(--bar-compare)" />
      <rect x="7" y="5" width="2" height="9" fill="var(--bar-swap)" />
      <rect x="10" y="2" width="2" height="12" fill="var(--bar-merge)" />
    </svg>
  );
}

// Searching — magnifying glass: silver ring, blue glass, dark handle.
export function SearchingIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <g fill="#9aa5b1">
        <rect x="1" y="1" width="8" height="2" />
        <rect x="1" y="7" width="8" height="2" />
        <rect x="1" y="3" width="2" height="4" />
        <rect x="7" y="3" width="2" height="4" />
      </g>
      <rect x="3" y="3" width="4" height="4" fill="var(--accent-blue)" />
      <g fill="var(--ink)">
        <rect x="9" y="9" width="2" height="2" />
        <rect x="11" y="11" width="2" height="2" />
      </g>
    </svg>
  );
}

// Data Structures — three stacked equal-width boxes (distinct orientation
// from the sorting bar chart: a vertical stack of horizontal blocks, not a
// row of vertical ones), one accent color each for a colorful read.
export function DataStructuresIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="3" y="1" width="8" height="3" fill="var(--accent-purple)" />
      <rect x="3" y="5" width="8" height="3" fill="var(--accent-blue)" />
      <rect x="3" y="9" width="8" height="3" fill="var(--accent-coral)" />
    </svg>
  );
}

// Trees — a 3-tier pixel canopy (green, with a darker-green shadow strip per
// tier for pixel-shading depth) over a brown trunk (also shadow-strip
// shaded). Brown has no existing token — hardcoded, representational only.
export function TreesIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="2" y="7" width="8" height="3" fill="var(--accent-green)" />
      <rect x="10" y="7" width="2" height="3" fill="#00b359" />
      <rect x="3" y="4" width="6" height="3" fill="var(--accent-green)" />
      <rect x="9" y="4" width="2" height="3" fill="#00b359" />
      <rect x="5" y="1" width="3" height="3" fill="var(--accent-green)" />
      <rect x="8" y="1" width="1" height="3" fill="#00b359" />
      <rect x="6" y="10" width="1" height="4" fill="#8b5a2b" />
      <rect x="7" y="10" width="1" height="4" fill="#6b4423" />
    </svg>
  );
}

// Graphs — four corner nodes in the GraphAnimationFrame state vocabulary
// (unvisited slate / visiting coral / visited green / frontier yellow)
// diagonally stubbed to a purple center hub. Same "node-and-edge cluster"
// spirit as LogoMark.tsx's hub-and-spoke, but a corner+diagonal-stub layout
// (not LogoMark's cardinal cross) so it doesn't read as a recolored logo,
// plus genuinely multi-color nodes instead of LogoMark's single currentColor.
export function GraphsIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <g fill="var(--ink-muted)">
        <rect x="3" y="3" width="2" height="2" />
        <rect x="9" y="3" width="2" height="2" />
        <rect x="3" y="9" width="2" height="2" />
        <rect x="9" y="9" width="2" height="2" />
      </g>
      <rect x="0" y="0" width="3" height="3" fill="var(--bar-default)" />
      <rect x="11" y="0" width="3" height="3" fill="var(--accent-coral)" />
      <rect x="0" y="11" width="3" height="3" fill="var(--bar-sorted)" />
      <rect x="11" y="11" width="3" height="3" fill="var(--accent-yellow)" />
      <rect x="5" y="5" width="4" height="4" fill="var(--accent-purple)" />
    </svg>
  );
}

// Dynamic Programming — a 3x3 cell grid echoing DPTableVisualizer's own
// palette: yellow read-cells feeding a coral compute-cell, a purple
// trace-back cell, the rest neutral/uncomputed.
export function DynamicProgrammingIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="0" y="0" width="4" height="4" fill="var(--bar-default)" />
      <rect x="5" y="0" width="4" height="4" fill="var(--accent-yellow)" />
      <rect x="10" y="0" width="4" height="4" fill="var(--bar-default)" />
      <rect x="0" y="5" width="4" height="4" fill="var(--accent-yellow)" />
      <rect x="5" y="5" width="4" height="4" fill="var(--accent-coral)" />
      <rect x="10" y="5" width="4" height="4" fill="var(--bar-default)" />
      <rect x="0" y="10" width="4" height="4" fill="var(--bar-default)" />
      <rect x="5" y="10" width="4" height="4" fill="var(--accent-purple)" />
      <rect x="10" y="10" width="4" height="4" fill="var(--bar-default)" />
    </svg>
  );
}

// Arrays & Hashing — a row of indexed cells (default slate) with one
// highlighted (coral), plus a tick mark under each cell as an "indexed
// slot" cue — distinct from the sorting bar chart (uniform height, ticks,
// single highlight vs. a full ascending gradient).
export function ArraysHashingIcon({ size = 32 }: CategoryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="1" y="5" width="2" height="4" fill="var(--bar-default)" />
      <rect x="4" y="5" width="2" height="4" fill="var(--bar-default)" />
      <rect x="7" y="5" width="2" height="4" fill="var(--accent-coral)" />
      <rect x="10" y="5" width="2" height="4" fill="var(--bar-default)" />
      <g fill="var(--ink-muted)">
        <rect x="1" y="10" width="2" height="1" />
        <rect x="4" y="10" width="2" height="1" />
        <rect x="7" y="10" width="2" height="1" />
        <rect x="10" y="10" width="2" height="1" />
      </g>
    </svg>
  );
}
