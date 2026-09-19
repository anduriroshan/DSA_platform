---
name: logo-mark-review
description: The logo-mark candidate review is resolved — candidate 3 (hub-and-spoke node graph) is live in LogoMark.tsx, wired into Navbar and footer. Only remaining open item is the favicon, which was never updated to match.
metadata:
  type: project
---

**Resolved as of 2026-09-19** (verified by reading the live files during a later, unrelated category-icons task): the 4-candidate comparison scaffold described earlier in this memory is gone from `frontend/src/pages/HomePage.tsx` — no `LogoMarkA`/`LogoMarkPlay`/`LogoMarkGraph`/`LogoMarkFlick`/`LogoOptionsReview` remain there, and `frontend/src/index.css` has no `.logo-review-*` rules left. The user picked **candidate 3, the hub-and-spoke node graph** (5 node squares in a plus arrangement — center + up/down/left/right — joined by two crossing 2px-wide bar "edges" at ~0.55 opacity).

That candidate is now the permanent `frontend/src/components/layout/LogoMark.tsx` (default export, `{ size?: number }` prop, `viewBox="0 0 14 14"`, `shapeRendering="crispEdges"`, `fill="currentColor"`), and is wired into both real locations:
- `Navbar.tsx`: `<span className="logo-icon"><LogoMark /></span>`
- `HomePage.tsx` footer: `<span className="footer-logo"><LogoMark size={16} /> AKGO<span className="brand-mark">FLICK</span></span>` (brand spelling: see [[brand-rename-algoflick]] before trusting the K here either)

## Still open: favicon not updated

`frontend/public/favicon.svg` (checked 2026-09-19) is still the original generic default — glossy purple/blue gradient blobs with `feGaussianBlur` filters, nothing pixel-art, no relation to `LogoMark`'s hub-and-spoke shape or the pixel design system at all. Step 3 of the original "what happens next" plan (consider making the chosen mark the new favicon) was never done. This is a real gap, not a stale memory — worth doing whenever favicon/branding work is next in scope, but wasn't part of any task through 2026-09-19.

## Reusable pattern this established

`LogoMark.tsx`'s technique (14x14 viewBox, integer rects, `crispEdges`, single-tone `currentColor`) is now the base pattern for this app's whole small-icon family, alongside `ThemeMotif.tsx` (same technique, also single-tone). See [[category_icons]] for the multi-color variant of this same technique, built for the homepage's category cards — deliberately *not* single-tone, since those needed to replace colorful emoji rather than sit inside a `currentColor`-driven brand box.
