# Technical Design Document

## Tech Stack
| Layer       | Technology | Version | Reason for Choice |
|-------------|------------|---------|-------------------|
| Language    | TypeScript | 5.x     | Type safety, better DX |
| CLI framework | Commander.js | 12.x | Industry standard, minimal |
| Notifications | node-notifier | 10.x | Cross-platform, maintained |
| Testing     | Vitest | 1.x | Fast, ESM-native |
| Runtime     | Node.js | ≥18 | LTS, native ESM support |
| Package mgr | pnpm | 9.x | Fast, disk efficient |

> Stack summary (no rationale) is repeated in `AGENTS.md` for quick AI reference.
> When the stack changes, update both files.

## Goals
- Zero external runtime dependencies beyond Commander and node-notifier
- Works entirely offline — no network calls ever
- Startup time under 50ms

## Non-Goals
- Daemon process or background service
- GUI, web interface, or TUI
- Multi-user or cloud sync
- Task management (timer only)

## Architecture Overview
Single-process CLI. Each command invocation reads state from disk, computes the result, writes state back, and exits. No long-running process.

## Directory Structure
<!-- See docs/ARCHITECTURE.md for the full folder map -->

## MCP Servers
| Server | Purpose | Config File | Notes |
|--------|---------|-------------|-------|
| — | No MCP servers used | — | Local CLI tool, no AI integrations |

## Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| POMO_CONFIG_DIR | Override default `~/.pomo/` directory | No |
| POMO_NO_NOTIFY | Disable desktop notifications | No |

## Database Schema
No database. State stored in `~/.pomo/state.json`:
```json
{
  "activeSession": {
    "startedAt": "ISO8601",
    "type": "work | short-break | long-break",
    "label": "optional string",
    "completedPomodoros": 0
  },
  "history": [
    { "startedAt": "ISO8601", "endedAt": "ISO8601", "type": "work", "label": "", "completed": true }
  ]
}
```

## API Endpoints
N/A — CLI tool, no HTTP API.

## Component Architecture
| Module | Responsibility |
|--------|----------------|
| `src/commands/` | One file per CLI command (start, stop, status, history, config) |
| `src/domain/session.ts` | Session entity, timer logic, break sequence rules |
| `src/domain/config.ts` | Config value object, defaults, validation |
| `src/storage/state.ts` | Read/write `~/.pomo/state.json` |
| `src/notifications/notifier.ts` | Notification abstraction over node-notifier |
| `src/cli.ts` | Commander.js entrypoint, command registration |

## Error Handling Strategy
- **Error classification:** domain errors (invalid state) vs I/O errors (file read/write)
- **Client-facing errors:** plain English to stderr, non-zero exit code
- **Logging:** nothing logged — CLI output only; no PII ever written
- **Alerting:** N/A — local tool

## Security Considerations
- **Authentication:** N/A
- **Authorization:** N/A — user's own files only
- **Data at rest:** state.json in user home dir — no encryption needed
- **Data in transit:** no network calls
- **Sensitive data handling:** no sensitive data collected

## Performance Considerations
- **SLA targets:** <50ms cold start
- **Caching strategy:** none needed
- **Known bottlenecks:** JSON file I/O on each command — acceptable at this scale
- **Scaling approach:** N/A

## Key Technical Decisions & Rationale
- **No daemon:** simplifies distribution and avoids OS-level permission complexity. Timer accuracy achieved by storing timestamps, not counting ticks.
- **Commander.js over yargs:** smaller bundle, simpler API for this command count.

## Known Technical Debt
-
