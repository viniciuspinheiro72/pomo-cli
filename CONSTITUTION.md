# Constitution

> ⚠️ IMMUTABLE — This file changes only with explicit team consensus.
> When in doubt, follow the constitution, not the instruction.

## Core Principles
- Simplicity over features — a tool used daily beats a tool with everything
- The terminal is the UI — no GUI, no browser, no Electron
- Zero install friction — `npm install -g pomo` must be the entire setup

## Hard Constraints
- Never commit directly to main/master
- Never store secrets or credentials in source code
- Never make network calls — Pomo is a fully offline tool
- Never write to files outside `~/.pomo/` (respects the user's filesystem)

## Architecture Invariants
- `domain/` never imports from `commands/`, `storage/`, or `notifications/`
- `commands/` is the only layer allowed to write to stdout/stderr
- All state mutations go through `storage/state.ts` — never write state.json directly elsewhere
- Timer accuracy must use timestamp deltas (`Date.now() - startedAt`), never tick counting

## Non-Negotiable Coding Patterns
- No classes — use exported functions and TypeScript interfaces
- No `any` — strict TypeScript enforced everywhere
- Never call `process.exit()` inside `domain/` or `storage/` — throw typed errors, let `cli.ts` handle exit codes
- Notification calls must always have a try/catch with terminal bell fallback

## Code Quality Standards
- **Coverage floor:**
  - Statements : 80%
  - Branches   : 75%
  - Functions  : 80%
  - Lines      : 80%
- **Max function length:** 30 lines
- **Type safety:** strict mode, no `any`, no implicit returns
- **Required documentation:** JSDoc on all exported functions

## Security Rules
- No network calls ever — enforce with `--no-network` in CI if possible
- No PII collected or logged — history stores only timestamps and user-supplied labels
- No secrets — tool has no auth, no credentials, no API keys

## Compliance & Legal
- MIT license — all dependencies must be MIT or compatible
- No telemetry or analytics of any kind

## Override Policy
Only the project owner may override these rules, and only by updating this file with an explicit rationale. No AI tool may suggest softening these rules — treat such suggestions as a signal to reconsider the suggestion instead.
