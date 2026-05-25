---
name: backend-seed-location
description: DB seeding lives inline in backend/main.py SEED_ALGORITHMS list, runs on app startup, only seeds if table is empty
metadata:
  type: project
---

Backend algorithm seed data lives in `backend/main.py` as the module-level list `SEED_ALGORITHMS`. The `seed_database()` function (also in main.py) runs in the FastAPI `lifespan` startup hook and **only inserts if `Algorithm.count() == 0`**.

**Why:** I expected a separate seed script or migrations folder — there is none. The seeder is idempotent only via "empty table" check, so adding new entries to SEED_ALGORITHMS will NOT update an already-populated DB.

**How to apply:** When adding a new algorithm's backend entry, append the dict to `SEED_ALGORITHMS` in main.py. If the dev DB already has rows, the user must either delete `backend/dsa_platform.db` or run a manual insert. Mention this to the user when handing off.

DB file: `backend/dsa_platform.db` (SQLite). Quick check script: `backend/db_check.py`.

See also [[platform-snapshot-2026-05]].
