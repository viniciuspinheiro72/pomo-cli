# Research Document

---

## Part 1 — Market Research

### Problem Statement
Developers spend significant time context-switching between terminal and Pomodoro GUI apps. No mature, scriptable CLI Pomodoro tool exists that works reliably cross-platform with desktop notifications.

### Target Users
- **Developer Dan** — Full-stack developer, works entirely in terminal, wants time-boxing without leaving the shell
- **Student Sam** — CS student on Linux, needs a lightweight focus tool that doesn't require installing Electron apps

### Competitor / Prior Art Analysis
| Name | Strengths | Weaknesses | URL |
|------|-----------|------------|-----|
| Toggl | Polished, team features | GUI-heavy, overkill for solo | toggl.com |
| `pomo` (npm) | Minimal CLI | Abandoned, no notifications | npmjs.com/package/pomo |
| `timer-cli` | Simple | No Pomodoro logic, no history | npmjs.com/package/timer-cli |
| Focus Booster | Pomodoro-native | Not CLI, subscription | focusboosterapp.com |

### Market Opportunity
The existing CLI options are abandoned or incomplete. A maintained, well-tested npm package with desktop notifications fills a real gap in the developer tooling ecosystem.

### Go / No-Go Decision
**Go** — low complexity, clear gap in existing tools, high personal utility.

---

## Part 2 — Technical Research

### Technical Feasibility
Fully feasible with Node.js. Desktop notifications via `node-notifier` (cross-platform). Timer logic is pure in-memory. JSON file for history is sufficient at this scale.

### Third-Party Services & APIs
| Service | Purpose | Pricing Model | Risk |
|---------|---------|---------------|------|
| node-notifier | Desktop notifications | Free / MIT | Low — well maintained |
| commander.js | CLI argument parsing | Free / MIT | Low — industry standard |

### Key Technical Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Notification support varies by OS | Medium | Medium | Test on macOS, Linux, Windows; graceful fallback to terminal bell |
| Timer drift over long sessions | Low | Low | Use `Date.now()` delta, not `setInterval` count |

### Proof of Concept Needed?
Desktop notification on all three platforms — validate `node-notifier` works correctly before building the full timer logic around it.
