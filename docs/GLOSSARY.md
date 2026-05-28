# Domain Glossary

## Pomodoro
- **Definition:** A single 25-minute focused work interval. The atomic unit of the Pomo system.
- **NOT:** A "session" in the generic sense — in this codebase, a Pomodoro is specifically a work interval, never a break.
- **Synonyms to avoid:** "work session", "focus session", "timer" — use "Pomodoro" or "work interval" only.
- **Code name:** `type: "work"` in state.json; `SessionType.Work` in TypeScript.
- **Related terms:** Interval, Cycle, Break.
- **Example:** "The user starts a Pomodoro; after 25 minutes, a short break begins automatically."

---

## Break
- **Definition:** A mandatory rest interval that follows a Pomodoro. Two subtypes: short break (5 min, after each Pomodoro) and long break (15 min, after every 4th Pomodoro in a Cycle).
- **NOT:** An optional pause — breaks are part of the Pomodoro technique and tracked in history.
- **Synonyms to avoid:** "rest", "pause", "downtime".
- **Code name:** `type: "short-break" | "long-break"` in state.json; `SessionType.ShortBreak`, `SessionType.LongBreak`.
- **Related terms:** Pomodoro, Cycle.
- **Example:** "After completing 4 Pomodoros in a Cycle, the next Break is a long break of 15 minutes."

---

## Interval
- **Definition:** Any single timed period — either a Pomodoro or a Break. The generic term when the distinction between work and rest doesn't matter.
- **NOT:** A recurring timer tick — an Interval is a complete timed block, not a unit of measurement.
- **Code name:** `Interval` (TypeScript interface); encompasses `SessionType` values.
- **Related terms:** Pomodoro, Break, Session.
- **Example:** "The `status` command shows how many seconds remain in the current Interval."

---

## Cycle
- **Definition:** A sequence of 4 Pomodoros, each separated by a short break, culminating in a long break. Completing a Cycle resets `completedPomodoros` to 0.
- **NOT:** A single Pomodoro or a generic loop — a Cycle is always exactly 4 Pomodoros.
- **Code name:** `completedPomodoros` counter in state.json; a Cycle completes when `completedPomodoros === 4`.
- **Related terms:** Pomodoro, Break.
- **Example:** "The user is on Pomodoro 3 of their current Cycle; one more Pomodoro will trigger a long break."

---

## State
- **Definition:** The persisted snapshot of the timer — what is currently active, when it started, and how many Pomodoros have been completed in the current Cycle. Stored in `~/.pomo/state.json`.
- **NOT:** Application state in the React/Redux sense — this is disk-persisted JSON, read fresh on every command invocation.
- **Code name:** `PomodoroState` (TypeScript interface); `state.json` on disk.
- **Related terms:** Interval, Cycle.
- **Example:** "On `pomo start`, the command writes a new State to disk with `startedAt` and `type: 'work'`."

---

## Label
- **Definition:** An optional short string the user attaches to a Pomodoro to describe what they worked on (e.g. `"Writing tests"`). Used in history display only — has no effect on timer behavior.
- **NOT:** A tag, category, or project — Label is free-text and unstructured.
- **Code name:** `label: string` in state.json and history entries.
- **Related terms:** Pomodoro, History.
- **Example:** "Running `pomo start \"Writing docs\"` attaches the Label \"Writing docs\" to the session."

---

## History
- **Definition:** The append-only log of all completed and stopped Intervals stored in `~/.pomo/state.json`. Each entry records start time, end time, type, label, and whether it completed normally.
- **NOT:** A database or queryable store — History is a simple JSON array, read entirely into memory.
- **Code name:** `history: HistoryEntry[]` in state.json; `HistoryEntry` TypeScript interface.
- **Related terms:** State, Interval, Label.
- **Example:** "The `pomo history` command reads the last 10 entries from History and formats them as a table."
