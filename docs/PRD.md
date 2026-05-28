# Product Requirements Document (PRD)

## Overview & Purpose
Pomo is a CLI Pomodoro timer that helps developers stay focused by managing timed work sessions and breaks from the terminal.

## Problem Statement
There is no maintained, cross-platform CLI Pomodoro tool with desktop notifications and session history.

## Target Users & Personas
- **Developer Dan** — works entirely in terminal, wants zero-friction time-boxing
- **Student Sam** — lightweight Linux user, needs something installable via npm

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| Developer adoption | npm weekly downloads | 500/week within 3 months |
| Reliability | Session completion rate | No timer drift >1s over 25min |
| Cross-platform | Notification delivery | Works on macOS, Ubuntu, Windows |

## Scope

### MVP Features — P0
- `pomo start` — start a 25-min Pomodoro session
- `pomo stop` — stop current session
- `pomo status` — show time remaining in current session
- Desktop notification when session or break ends
- Automatic short break (5 min) after each session
- Automatic long break (15 min) after 4 sessions

### Important Features — P1
- `pomo history` — show last N sessions with durations and dates
- `pomo config` — set custom session/break durations
- Session labels (`pomo start "Writing tests"`)

### Nice-to-have — P2
- Sound alert as alternative to notification
- `pomo stats` — weekly/monthly summary
- Shell prompt integration (show remaining time in PS1)

## Functional Requirements
- Timer must persist across terminal sessions (store state in `~/.pomo/state.json`)
- Notification must fire even if the terminal tab is not focused
- `pomo start` while a session is active should warn, not silently restart

## Non-Functional Requirements
| Attribute    | Requirement | Notes |
|--------------|-------------|-------|
| Performance  | < 50ms startup time | No slow imports |
| Scalability  | N/A | Single-user local tool |
| Availability | N/A | Local CLI |
| Security     | No network access | No telemetry, no remote calls |
| Accessibility| Terminal bell fallback | When notifications unavailable |

## User Stories & Acceptance Criteria

**As Developer Dan, I want to start a Pomodoro session so I can time-box my work.**
- Given: no session is active — When: I run `pomo start` — Then: a 25-min timer starts and I see "🍅 Session started. 25:00 remaining."
- Given: a session is active — When: I run `pomo start` — Then: I see a warning with time remaining, session is not restarted.

**As Developer Dan, I want a notification when my session ends so I know to take a break.**
- Given: a session completes — When: the timer reaches 0 — Then: a desktop notification fires and the break timer starts automatically.

## Milestones & Releases
- v0.1 — `start`, `stop`, `status` + notifications (MVP)
- v0.2 — `history`, `config`, session labels
- v1.0 — stable API, published to npm

## Assumptions & Constraints
- Node.js ≥ 18 required
- State stored in `~/.pomo/` (user home dir)
- No daemon process — timer state stored to disk, checked on each command

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| node-notifier deprecated | Low | High | Abstract notification behind interface |
| Timer inaccuracy without daemon | Medium | Low | Store start timestamp, compute remaining on each `status` call |

## Open Questions
- Should `pomo stop` log an incomplete session to history?
