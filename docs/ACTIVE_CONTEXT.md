# Active Context

<!-- Update this file at the START and END of every AI session.
     It is the first doc read each session to restore project state. -->

## Current Focus
Pause/resume and sound alert shipped. Timer is now feature-complete for daily use.

## In Progress
- Nothing

## Blockers
- None

## Next Steps
- `pomo stats` — weekly/monthly summary (P2)
- Shell prompt integration (P2)

## Significant Decisions
- 2026-05-27 — Stateless CLI architecture chosen (no daemon) — see ADR-001
- 2026-05-27 — `--manual` flag stored on `ActiveSession`; `status` and `watch` check it before auto-advancing
- 2026-05-30 — Pause implemented as `pausedAt` timestamp on `ActiveSession`; resume shifts `startedAt` forward so all downstream logic stays unchanged
- 2026-05-30 — Pause/resume exposed as keypresses (`p`/space) inside `pomo watch` only — no separate CLI commands
- 2026-05-30 — Sound uses `spawnSync` with `paplay`/`aplay` on Linux, `afplay` on macOS, 3× bell fallback; no new npm deps

## Recent Context
- 2026-05-27 — Project initialized with init-docs. All documentation scaffolded.
- 2026-05-27 — Implemented `start`, `stop`, `status`, `history`, `config`, `watch` commands.
- 2026-05-27 — Added `--manual` / `-m` flag to `pomo start` — disables auto-advance on session expiry.
- 2026-05-30 — Added pause/resume (keypress in watch) and sound alert on session end.

## Open Questions
- Should `pomo stop` log an incomplete session to history? (see PRD Open Questions)
