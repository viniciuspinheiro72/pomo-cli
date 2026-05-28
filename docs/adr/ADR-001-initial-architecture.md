---
status: Accepted
date: 2026-05-27
decision-makers: Solo developer
consulted: —
informed: —
---

# ADR-001: Initial Architecture — Stateless CLI with Disk-Persisted State

## Context and Problem Statement
Pomo is a single-user CLI tool. The core challenge is maintaining timer state across command invocations (each `pomo status` or `pomo stop` is a fresh process) without running a background daemon, which would complicate distribution and require OS-level permissions.

## Decision Drivers
- Must work on macOS, Linux, and Windows without a system service or daemon
- Must be installable via `npm install -g pomo` with zero setup
- Single developer — no coordination overhead needed
- Timer accuracy is acceptable at ±1s; sub-second precision not required

## Considered Options
- **Option A:** Stateless CLI with disk-persisted timestamps (chosen)
- **Option B:** Background daemon (long-running Node.js process) with IPC
- **Option C:** SQLite database for state and history

## Decision Outcome
Chosen: **Option A — Stateless CLI with disk-persisted timestamps** because it requires no daemon, no IPC, and no native dependencies beyond `node-notifier`.

### Consequences
- **Positive:** Simple distribution, no install friction, works on all platforms
- **Negative:** Cannot fire a notification mid-session without a background process — notification fires on next `pomo status` poll or via a companion `pomo wait` command
- **Neutral:** Timer accuracy depends on when the user runs `pomo status` — acceptable for Pomodoro use case

### Confirmation
Architecture is confirmed correct when: `pomo start` followed by `pomo status` in a new shell process shows correct remaining time without any daemon running.

## Pros and Cons of the Options

### Option A — Stateless CLI with disk timestamps
- ✅ Zero setup, works anywhere Node runs
- ✅ No background process to manage or kill
- ❌ Cannot push notifications automatically — requires user to poll or use `pomo wait`

### Option B — Background daemon with IPC
- ✅ Can fire notifications automatically at exact moment
- ❌ Complex distribution (need service manager or launchd/systemd integration)
- ❌ Platform-specific IPC (Unix sockets vs. Windows named pipes)

### Option C — SQLite for state
- ✅ Structured queries for history
- ❌ Requires native SQLite bindings — adds install friction and platform issues
- ❌ Overkill for a single JSON object and a small append-only log

## Review Trigger
Revisit if users strongly request automatic mid-session notifications without polling — at that point, evaluate Option B with a simple Node.js child process daemon.
