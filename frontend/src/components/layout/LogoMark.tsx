interface LogoMarkProps {
  size?: number;
}

// Akgoflick's brand mark — a small hub-and-spoke node graph, a nod to
// "data structures & algorithms". Same 14x14 pixel-grid convention as
// ThemeMotif.tsx (crispEdges, currentColor) so it drops into any
// currentColor-driven box (navbar .logo-icon, footer-logo) unstyled.
export default function LogoMark({ size = 14 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" shapeRendering="crispEdges">
      <g fill="currentColor" opacity="0.55">
        <rect x="6" y="4" width="2" height="6" />
        <rect x="4" y="6" width="6" height="2" />
      </g>
      <g fill="currentColor">
        <rect x="5" y="0" width="4" height="4" />
        <rect x="5" y="10" width="4" height="4" />
        <rect x="0" y="5" width="4" height="4" />
        <rect x="10" y="5" width="4" height="4" />
        <rect x="5" y="5" width="4" height="4" />
      </g>
    </svg>
  );
}
