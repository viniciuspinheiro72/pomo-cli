# Decision Log

<!-- One entry per significant decision. Newest first.
     For major architectural decisions, write a full ADR in docs/adr/ instead. -->

### 2026-05-27 — Use pnpm over npm/yarn
- **Decision:** pnpm as the package manager
- **Why:** Faster installs, disk-efficient, strict dependency isolation prevents phantom deps
- **Alternatives considered:** npm (default, slower), yarn (no significant advantage here)
- **Consequences:** Contributors need pnpm installed; `pnpm install` instead of `npm install`

### 2026-05-27 — Vitest over Jest
- **Decision:** Vitest as the test runner
- **Why:** Native ESM support without transform config; faster than Jest for TypeScript projects
- **Alternatives considered:** Jest (would need `ts-jest` or `babel-jest` for ESM — extra config)
- **Consequences:** `pnpm test` uses Vitest; `vi.mock()` instead of `jest.mock()`
