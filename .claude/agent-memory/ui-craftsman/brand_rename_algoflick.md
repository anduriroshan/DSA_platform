---
name: brand-rename-algoflick
description: Brand spelling has flip-flopped twice in one day (2026-09-19) — as of the latest check it is "Akgoflick" (K, third letter) everywhere live. Never trust a memory or a task instruction about this spelling; grep the live files fresh every time.
metadata:
  type: project
---

**Current ground truth (verified 2026-09-19, by grepping every live file, not by trusting any memory or instruction):** the brand is spelled **Akgoflick** — A-K-G-O-F-L-I-C-K, a K as the third letter, NOT an L. Confirmed simultaneously across `frontend/src/index.css` (header comment: "AKGOFLICK — Pixel-Art Learning Platform Design System"), `frontend/src/hooks/useSEO.ts` (`BASE_TITLE = 'Akgoflick'`), `frontend/src/components/layout/Navbar.tsx` (`AKGO` + accent `FLICK` span), `frontend/src/components/layout/LogoMark.tsx` (comment), and `frontend/src/pages/HomePage.tsx` (SEO description, footer brand span, footer bottom line) — zero occurrences of the L-spelled "Algoflick" anywhere in `frontend/src` as of this check.

**Why this memory exists, and why it's worded so defensively:** this spelling has now flipped at least twice in a single day inside this same repo:
1. An earlier agent run "corrected" an original "Akgoflick" to "Algoflick" (L), believing it was fixing a typo, touching files it wasn't even asked to touch.
2. That was reverted back to "Akgoflick" (K) by the user/orchestrator.
3. A prior version of *this very memory file* had recorded step 2's end state backwards — asserting "Algoflick" (L) was the confirmed live spelling and that an instruction calling it "Akgoflick" was the mistake. That was wrong at the time this memory was rewritten (2026-09-19, category-icons task) — live grep showed K everywhere, matching the task instruction, not the memory.

**The lesson, stated plainly: do not trust this memory's spelling either.** Don't trust a task instruction's spelling. Don't trust your own recollection from earlier in a long conversation. The only reliable source is grepping the *current* live files (`Navbar.tsx`, `index.css` header, `useSEO.ts`, `HomePage.tsx` footer) at the start of any task that touches brand text, every single time, even if you did it minutes ago in the same session — because this project has demonstrated it will change underneath you.

**How to apply:** Before writing any new user-facing brand text, grep fresh. If you find a spelling inconsistency somewhere unexpected, flag it rather than silently "fixing" it — brand text is the orchestrator's/user's call, not this agent's to unilaterally correct, and "obviously a typo" has already been wrong twice here.

**localStorage keys:** `frontend/src/store/useVisualizerStore.ts` uses `akgoflick.vizPanelOpen` / `akgoflick.vizPanelWidth` / `akgoflick.codeEditorOpen` / `akgoflick.theme` — this now *matches* the K-spelled brand (verified 2026-09-19), so there is currently no leftover-spelling inconsistency here. (An earlier version of this memory claimed there was, back when the memory itself incorrectly believed the brand was L-spelled — that claim is retracted.)

See [[theme_system_minecraft]] (theme preference persists under the `akgoflick.theme` key) and [[logo_mark_review]] (brand mark, same naming volatility risk applies to any mark comment/label).
