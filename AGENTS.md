# AGENTS.md — Codex Operating Manual for PokeVolume

This file defines strict operating rules for AI agents modifying this repository.

Agents MUST follow these constraints.

---

## 1. Core Architecture

Stack:

Frontend:
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Recharts

Backend:
- Next.js API routes
- Node.js

Database:
- PostgreSQL
- Prisma ORM

Jobs:
- Background ingestion tasks under /jobs
- No scraping without official API access

Deployment:
- Vercel (frontend)
- Railway or Supabase (database)

---

## 2. Non-Negotiable Build Rule

CI MUST PASS.

If CI fails:
- Make the smallest possible change to restore green build.
- Do NOT remove tests to pass CI.
- Do NOT disable lint or type checking.
- Do NOT bypass Prisma constraints.
- Prefer code alignment to schema over schema deletion.

All fixes must be minimal diffs.

---

## 3. Code Standards

- TypeScript only (except Next config which must be .js or .mjs)
- No `any` types unless unavoidable and documented
- Functional components only
- No unused exports
- No dead code

Directory separation:

/lib → pure business logic  
/prisma → schema + migrations  
/jobs → ingestion tasks  
/components → UI  
/app/api → API routes  

Environment variables:
- Stored in .env.local (local)
- Stored in GitHub Secrets (CI)
- Never committed

---

## 4. Prisma Rules

- Do NOT assume fields are unique unless marked `@unique` in schema
- Do NOT use upsert with non-unique fields
- If model requires relation (e.g. series on set), connect or create required relation
- Align code to schema; do not silently remove required fields

When in doubt:
- Inspect prisma/schema.prisma before modifying queries

---

## 5. Data Ingestion Rules

- Use official APIs only
- Store raw payload before normalization
- Normalization must be deterministic
- Idempotent ingestion required
- No duplicate sale rows
- Missing dimensions must default to "Unknown"

---

## 6. Analytics Rules

- No analytics in frontend
- All aggregations computed server-side
- Prefer SQL or Prisma aggregations
- Future materialized views allowed

---

## 7. CI + Auto-Fix Protocol

When CI fails:

1. Analyze the failing step.
2. Reproduce failure locally (in CI environment if applicable).
3. Apply minimal fix.
4. Commit only relevant changes.
5. Open PR titled:
   "Auto-fix CI failure"

Agents must:
- Avoid rewriting unrelated files.
- Avoid reformatting entire codebase.
- Avoid adding new dependencies unless necessary.
- Avoid schema migrations unless explicitly required.

---

## 8. Prohibited Actions

- No web scraping violating ToS
- No storing API keys in repo
- No disabling CI checks
- No removing required Prisma relations
- No deleting failing tests instead of fixing logic
- No large refactors during CI repair

---

## 9. Development Philosophy

- Small diffs > large rewrites
- Stability > feature velocity
- Schema integrity > shortcut fixes
- Green CI is mandatory before new features

---

This repository prioritizes:
Data correctness
Schema integrity
Deterministic ingestion
Reproducible builds
