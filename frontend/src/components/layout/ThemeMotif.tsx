interface ThemeMotifProps {
  theme: 'light' | 'dark';
}

/**
 * The platform's signature per-theme motif: a small pixel-art sun (day) or
 * crescent moon + stars (night), built from plain SVG <rect> on a fixed
 * pixel grid — no images, no blur, no animation loop. Cheap to render (a
 * handful of rects) and pairs with the `--accent-primary` token, which is
 * the only color that actually swaps between the two worlds.
 *
 * Placed in the navbar next to the theme toggle so the icon itself reads as
 * "which world you're in," not just a label.
 */
export default function ThemeMotif({ theme }: ThemeMotifProps) {
  return (
    <svg
      className="theme-motif"
      width="20"
      height="20"
      viewBox="0 0 14 14"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {theme === 'dark' ? (
        <>
          <g fill="var(--accent-primary)">
            <rect x="4" y="1" width="4" height="2" />
            <rect x="2" y="3" width="2" height="2" />
            <rect x="1" y="5" width="2" height="4" />
            <rect x="2" y="9" width="2" height="2" />
            <rect x="4" y="11" width="4" height="2" />
          </g>
          <g className="theme-motif-twinkle" fill="var(--text-light)">
            <rect x="10" y="2" width="1.4" height="1.4" />
            <rect x="12" y="6.5" width="1.4" height="1.4" />
            <rect x="9" y="10.5" width="1.4" height="1.4" />
          </g>
        </>
      ) : (
        <>
          <g fill="var(--accent-primary)">
            <rect x="5" y="5" width="4" height="4" />
            <rect x="4" y="4" width="1" height="1" />
            <rect x="9" y="4" width="1" height="1" />
            <rect x="4" y="9" width="1" height="1" />
            <rect x="9" y="9" width="1" height="1" />
          </g>
          <g className="theme-motif-twinkle" fill="var(--accent-primary-dim)">
            <rect x="6" y="0" width="2" height="2" />
            <rect x="6" y="12" width="2" height="2" />
            <rect x="0" y="6" width="2" height="2" />
            <rect x="12" y="6" width="2" height="2" />
          </g>
        </>
      )}
    </svg>
  );
}
