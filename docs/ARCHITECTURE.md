# Architecture

## Overview
Flat modular CLI — no layered architecture. Each module has a single responsibility: `commands/` handles CLI I/O, `domain/` owns all timer logic, `storage/` owns disk persistence, `notifications/` abstracts desktop alerts. No module imports from `commands/`. Dependencies flow inward toward `domain/`.

## Directory Structure
```
pomo/
├── src/
│   ├── cli.ts              ← Commander.js entrypoint, registers all commands
│   ├── commands/           ← One file per CLI command (start, stop, status, history, config)
│   ├── domain/             ← Timer logic, session rules, break sequence, config values
│   ├── storage/            ← Reads and writes ~/.pomo/state.json
│   └── notifications/      ← Abstraction over node-notifier
├── tests/
│   ├── unit/               ← Domain logic tests (pure, no I/O)
│   └── integration/        ← Command tests against temp state dir
├── docs/
└── package.json
```

## Module Responsibilities
| Module | Folder | Responsibility |
|--------|--------|----------------|
| CLI Entrypoint | `src/cli.ts` | Registers commands, parses args, delegates to commands/ |
| Commands | `src/commands/` | Reads state, calls domain logic, writes state, outputs to stdout |
| Domain | `src/domain/` | Session entity, timer math, break sequence rules, config validation |
| Storage | `src/storage/` | Read/write state.json, create ~/.pomo/ dir if missing |
| Notifications | `src/notifications/` | Fire desktop notification, fallback to terminal bell |

## Dependency Rules
- `domain/` imports nothing from this project — pure logic only
- `storage/` imports from `domain/` (to use types), never from `commands/`
- `notifications/` imports nothing from this project
- `commands/` imports from `domain/`, `storage/`, and `notifications/`
- `cli.ts` imports from `commands/` only

## Data Flow
```
CLI invocation
  → cli.ts (Commander parses args)
  → commands/[command].ts
      → storage/state.ts (read current state)
      → domain/session.ts (compute new state)
      → storage/state.ts (write new state)
      → notifications/notifier.ts (if session ended)
  → stdout (user-facing output)
  → exit
```

## Where to Add New Things
| Thing | Where |
|-------|-------|
| New CLI command | `src/commands/` + register in `src/cli.ts` |
| New timer rule | `src/domain/session.ts` |
| New config option | `src/domain/config.ts` + `src/commands/config.ts` |
| New unit test | `tests/unit/` mirroring `src/domain/` structure |
| New integration test | `tests/integration/` mirroring `src/commands/` structure |

## Key Conventions
- Full conventions in `docs/STRUCTURE.md`
- No class inheritance — prefer plain functions and interfaces
- No global mutable state — all state goes through `storage/`

## Architecture Decision Records
- Location: `docs/adr/`
- Write an ADR when: changing the tech stack, introducing a new pattern, making a security trade-off, or deprecating a core abstraction.
- See `docs/adr/ADR-001-initial-architecture.md` for the first entry and format reference.
