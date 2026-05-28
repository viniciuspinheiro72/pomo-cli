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
pomo status             # Check time remaining (one-shot)
pomo watch              # Live display — updates every second
pomo stop               # Stop the current session
pomo history            # Show last 10 sessions
pomo history 20         # Show last 20 sessions
pomo config             # Show current config
pomo config workDurationMs 1500000  # Set work duration to 25 min (ms)
```

## How it works

- No daemon — timer state is stored in `~/.pomo/state.json`
- `pomo watch` runs a live display that refreshes every second and auto-advances to the next session when time is up
- After 4 Pomodoros, a long break (15 min) is triggered automatically
- Desktop notifications via `node-notifier` with terminal bell fallback

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
