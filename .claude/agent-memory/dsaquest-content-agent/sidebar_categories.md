---
name: sidebar-categories
description: Sidebar.tsx CATEGORY_META now covers 6 categories; new categories beyond these need UI agent
metadata:
  type: project
---

`frontend/src/components/layout/Sidebar.tsx` `CATEGORY_META` map now contains entries for: `sorting`, `searching`, `data-structures`, `trees`, `graphs` (icon ⌬), `dynamic-programming` (icon ▦).

**Why:** Sidebar will only render a section with proper icon/label if the category key exists in CATEGORY_META; otherwise it shows the raw kebab-case key.

**How to apply:** When introducing yet another category (e.g., `strings`, `system-design`, `math`), hand off to the UI agent with the exact category slug and a suggested icon+label pair. Do not silently add a new category to the registry without flagging this.

See also [[platform-snapshot-2026-05]].
