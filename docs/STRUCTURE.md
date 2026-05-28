# Codebase Structure & Conventions

## File Naming
- **Source files:** `kebab-case.ts` (e.g. `session.ts`, `state-reader.ts`)
- **Test files:** `*.test.ts` co-located under `tests/unit/` or `tests/integration/`
- **Config files:** `*.config.ts` at root (e.g. `vitest.config.ts`)
- **Type definition files:** types declared in the same file as their module — no separate `*.types.ts`

## Folder Organization
- **Pattern:** responsibility-first (by module role, not by feature)
- **One file per command** in `src/commands/`, named after the command:
  ```
  src/
  ├── commands/
  │   ├── start.ts
  │   ├── stop.ts
  │   ├── status.ts
  │   ├── history.ts
  │   └── config.ts
  └── domain/
      ├── session.ts      ← Session entity + timer logic
      └── config.ts       ← Config value object + defaults
  ```

## Import Conventions
- **Absolute vs relative:** relative imports only (no path aliases — project is small)
- **Import order:** Node built-ins → external packages → internal modules
- **Barrel exports:** no `index.ts` barrels — import directly from the file
- **Example:**
  ```ts
  import { readFileSync } from 'fs'         // Node built-in
  import { Command } from 'commander'       // external
  import { readState } from '../storage/state' // internal
  ```

## Naming Conventions
- **Variables / functions:** `camelCase`
- **Types / interfaces:** `PascalCase`
- **Enums:** `PascalCase` for the enum, `PascalCase` for values (e.g. `SessionType.Work`)
- **Constants:** `SCREAMING_SNAKE_CASE` for module-level constants
- **Environment variables:** `SCREAMING_SNAKE_CASE` with `POMO_` prefix

## Code Style
**Preferred style — prefer plain functions over classes:**
```ts
// ✅ Good
export function computeRemaining(state: ActiveSession): number {
  return state.durationMs - (Date.now() - state.startedAt)
}

// ❌ Avoid
export class SessionTimer {
  computeRemaining() { ... }
}
```

## Co-location Rules
- **Tests:** centralized in `tests/unit/` (mirrors `src/domain/`) and `tests/integration/` (mirrors `src/commands/`)
- **Types:** co-located with their module — `domain/session.ts` exports both the function and the `Session` type
- **No CSS, no migrations** — CLI project

## What NOT to Do
- Do not use classes — prefer exported functions and interfaces
- Do not import `commander` outside of `src/cli.ts` and `src/commands/`
- Do not write directly to stdout in `domain/` or `storage/` — only `commands/` outputs to the user
- Do not use `any` — strict TypeScript mode enforced
- Do not call `process.exit()` in domain or storage modules — throw errors, let `cli.ts` handle exit codes
