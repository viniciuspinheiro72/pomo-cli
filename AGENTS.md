# AGENTS.md — AI Context File

## Role
You are a TypeScript CLI engineer working on Pomo, a minimal Pomodoro timer for the terminal. You write pure functions over classes, never use `any`, always add try/catch around notification calls, and keep every module's responsibility tightly scoped. You verify your output by running `pnpm test` after every change.

## Project Description
Pomo is a command-line Pomodoro timer that manages focused work sessions and breaks from the terminal. It is a fully offline, single-user tool distributed via npm. State is persisted to `~/.pomo/state.json` — no daemon, no network, no GUI.

## Project Structure
```
pomo/
├── src/
│   ├── cli.ts              ← Commander.js entrypoint
│   ├── commands/           ← start.ts, stop.ts, status.ts, history.ts, config.ts
│   ├── domain/             ← session.ts, config.ts (pure logic)
│   ├── storage/            ← state.ts (read/write ~/.pomo/state.json)
│   └── notifications/      ← notifier.ts (node-notifier abstraction)
├── tests/
│   ├── unit/               ← domain logic tests
│   └── integration/        ← command tests against temp dirs
└── docs/
```

## Tech Stack
| Layer         | Technology    | Version |
|---------------|--------------|---------|
| Language      | TypeScript   | 5.x     |
| CLI framework | Commander.js | 12.x    |
| Notifications | node-notifier| 10.x    |
| Testing       | Vitest       | 1.x     |
| Runtime       | Node.js      | ≥18     |
| Package mgr   | pnpm         | 9.x     |

> Full rationale → `docs/TECH_DESIGN.md`
> When the stack changes, update both this file and TECH_DESIGN.md.

## Coding Conventions
- **Language version:** TypeScript 5.x, ESM modules (`"type": "module"` in package.json)
- **Naming conventions:** camelCase for variables/functions, PascalCase for types/interfaces
- **File naming:** kebab-case.ts
- **Import order:** Node built-ins → external packages → internal modules (relative)

**Style example:**
```ts
export function computeRemaining(session: ActiveSession): number {
  return session.durationMs - (Date.now() - session.startedAt)
}
```

## Lint & Format Process
- **Tool:** ESLint + Prettier
- **Config file:** `eslint.config.ts`, `.prettierrc`
- **Run locally:**
  ```bash
  # Format:
  pnpm format
  # Lint (check only):
  pnpm lint
  # Lint (auto-fix):
  pnpm lint:fix
  ```
- **Enforcement:** CI blocks on lint errors
- **Rules that are errors:** `no-any`, `no-explicit-any`, `no-unused-vars`

## Testing
```bash
# Run all tests:
pnpm test
# Run a single test file:
pnpm test tests/unit/session.test.ts
# Run with coverage:
pnpm test --coverage
# Run only unit tests:
pnpm test tests/unit
```
- **Framework:** Vitest
- **Test file location:** centralized in `tests/unit/` and `tests/integration/`
- **Naming convention:** `*.test.ts`
- **What to mock:** always mock `Date.now()` for timer tests; always mock `notifications/notifier.ts`; never mock `storage/` in integration tests — use real files in temp dirs

## Advisory Patterns

### Prefer
- Plain exported functions over classes
- `Date.now()` delta for time calculations over `setInterval` counting
- Explicit error types (`DomainError`, `StorageError`) over generic `Error`
- Temp dirs (`POMO_CONFIG_DIR`) in tests over mocking `storage/`

### Avoid
- Any imports from `commander` outside `src/cli.ts` and `src/commands/`
- Writing to stdout/stderr outside `src/commands/`
- Barrel `index.ts` files — import directly from source files

## Boundaries

### ✅ Always
- Run `pnpm lint && pnpm test` after every code change
- Use `POMO_CONFIG_DIR` env var for test isolation (never touch real `~/.pomo/`)
- Wrap notification calls in try/catch with terminal bell fallback

### ⚠️ Ask First
- Adding or removing npm dependencies
- Changing state.json schema (breaking change for existing users)
- Modifying CLI command names or flags (breaking change)

### 🚫 Never
- Make network calls of any kind
- Write files outside `~/.pomo/` (or `POMO_CONFIG_DIR`)
- Use `any` in TypeScript
- Call `process.exit()` from `domain/` or `storage/`

## Common Commands
```bash
# Install dependencies:
pnpm install
# Build:
pnpm build
# Run locally (without installing):
node dist/cli.js start
# Publish to npm:
pnpm publish
```

## Git Workflow

### Branch Naming
- Pattern: `<type>/<short-description>`
- Types allowed: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Max length: 50 characters

### Commit Message Format
- Format: `<type>(scope): <description>`
- Types allowed: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Max subject length: 72 characters
- Body: optional, use for non-obvious reasoning
- Footer: `Closes #123` for issues

### Merge Strategy
- Squash merge into main — one commit per feature/fix

## Key Files
| File | Purpose |
|------|---------|
| `src/cli.ts` | Commander.js entrypoint — all commands registered here |
| `src/domain/session.ts` | Core timer logic — Session entity, break sequence |
| `src/storage/state.ts` | Read/write `~/.pomo/state.json` |
| `src/notifications/notifier.ts` | node-notifier abstraction with fallback |

## External Documentation
| Resource | URL or Path | Notes |
|----------|------------|-------|
| Commander.js | https://github.com/tj/commander.js | CLI arg parsing |
| node-notifier | https://github.com/mikaelbr/node-notifier | Desktop notifications |
| Vitest | https://vitest.dev | Test runner |

## Session Protocol

### Session Start
1. Read `docs/ACTIVE_CONTEXT.md` to restore state from the last session.
2. Read `CONSTITUTION.md` to re-anchor on hard rules.

### During the Session
- When a significant decision is made → append a one-liner to `docs/DECISION_LOG.md`.
- When an unexpected problem or gotcha is encountered → append to `docs/PITFALLS.md`.

### Session End
1. Update `docs/ACTIVE_CONTEXT.md`: what changed, what's next, any open questions.
2. Update `docs/PROGRESS.md` if work moved between Done / In Progress / Blocked.

## Related Documents

### Always Loaded
- Constitution: `./CONSTITUTION.md`
- Product Brief: `./docs/PRODUCT_BRIEF.md`
- Architecture: `./docs/ARCHITECTURE.md`
- Structure: `./docs/STRUCTURE.md`
- Glossary: `./docs/GLOSSARY.md`
- Active Context: `./docs/ACTIVE_CONTEXT.md`

### Auto (loaded when relevant)
- PRD: `./docs/PRD.md`
- Tech Design: `./docs/TECH_DESIGN.md`
- Testing: `./docs/TESTING.md`
- Research: `./docs/RESEARCH.md`

### Manual (explicitly requested)
- Progress: `./docs/PROGRESS.md`
- Decision Log: `./docs/DECISION_LOG.md`
- Pitfalls: `./docs/PITFALLS.md`
- ADRs: `./docs/adr/`
