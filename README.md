# pomo

A minimal Pomodoro timer for the terminal.

## Install

```bash
npm install -g pomo-cli
```

Requires Node.js ≥ 18.

## Usage

```bash
pomo start              # Start a 25-min Pomodoro
pomo start "Deep work"  # Start with a label
pomo start --manual     # Start in manual mode (no auto-advance)
pomo start -m "Focus"   # Manual mode with a label
pomo status             # Check time remaining (one-shot)
pomo watch              # Live display — updates every second
pomo stop               # Stop the current session
pomo history            # Show last 10 sessions
pomo history 20         # Show last 20 sessions
pomo config             # Show current config
pomo config workDurationMs 1500000  # Set work duration to 25 min (ms)
```

## pomo watch — keyboard controls

| Key | Action |
|-----|--------|
| `p` or `Space` | Pause / resume the current session |
| `q` or `Ctrl+C` | Exit watch |

When paused the clock freezes, the progress bar holds, and the session is saved to disk — you can restart `pomo watch` and pick up where you left off.

```
```

## How it works

- No daemon — timer state is stored in `~/.pomo/state.json`
- `pomo watch` runs a live display that refreshes every second and auto-advances to the next session when time is up
- After 4 Pomodoros, a long break (15 min) is triggered automatically
- Sound alert + desktop notification when a session ends (`node-notifier`, with terminal bell fallback)
- Pause state persists to disk — safe to close and reopen `pomo watch`

## Manual mode

By default, pomo automatically advances to the next interval (break or Pomodoro) when the current one ends. Use `--manual` / `-m` to take control instead:

```bash
pomo start --manual
```

In manual mode, when the timer expires the session is cleared and pomo waits. Run `pomo start` again when you're ready to begin the next interval.

## Configuration

| Key | Default | Description |
|-----|---------|-------------|
| `workDurationMs` | `1500000` | Work session duration (25 min) |
| `shortBreakMs` | `300000` | Short break duration (5 min) |
| `longBreakMs` | `900000` | Long break duration (15 min) |
| `pomodorosPerCycle` | `4` | Pomodoros before a long break |

Override the config directory:
```bash
POMO_CONFIG_DIR=/tmp/pomo pomo start
```

Disable notifications:
```bash
POMO_NO_NOTIFY=1 pomo status
```

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
