import { readState, writeState, readConfig } from '../storage/state.js'
import {
  computeRemaining,
  formatDuration,
  isExpired,
  isPaused,
  pauseSession,
  resumeSession,
  sessionTypeLabel,
  getNextBreakType,
  createSession,
} from '../domain/session.js'
import { DEFAULT_CONFIG, validateConfig } from '../domain/config.js'
import { notify } from '../notifications/notifier.js'
import type { HistoryEntry, PomodoroState, PomoConfig } from '../domain/types.js'

const BAR_WIDTH = 32

export function renderProgressBar(remaining: number, total: number): string {
  const progress = Math.max(0, Math.min(1, 1 - remaining / total))
  const filled = Math.round(progress * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

export function renderFrame(state: PomodoroState, config: PomoConfig): string {
  if (!state.activeSession) {
    return [
      '',
      "  No active session. Run 'pomo start' to begin.",
      '',
      '  Press q to exit.',
      '',
    ].join('\n')
  }

  const session = state.activeSession
  const paused = isPaused(session)
  const remaining = Math.max(0, computeRemaining(session))
  const bar = renderProgressBar(remaining, session.durationMs)
  const type = sessionTypeLabel(session.type)
  const label = session.label ? ` — "${session.label}"` : ''
  const pausePrefix = paused ? '⏸ ' : ''

  const pomodoroInCycle = (session.completedPomodoros % config.pomodorosPerCycle) + 1
  const cycleInfo =
    session.type === 'work'
      ? `Pomodoro ${pomodoroInCycle} of ${config.pomodorosPerCycle}`
      : session.type === 'short-break'
        ? 'Short break'
        : 'Long break'

  const hint = paused
    ? `${cycleInfo}   ·   PAUSED — p to resume · q to quit`
    : `${cycleInfo}   ·   p to pause · q to quit`

  return [
    '',
    `  ${pausePrefix}${type}${label}`,
    '',
    `  ${bar}  ${formatDuration(remaining)}`,
    '',
    `  ${hint}`,
    '',
  ].join('\n')
}

function tick(): void {
  const state = readState()
  const config = validateConfig({ ...DEFAULT_CONFIG, ...readConfig() })

  if (state.activeSession && isExpired(state.activeSession)) {
    const session = state.activeSession
    const completedPomodoros =
      session.type === 'work' ? session.completedPomodoros + 1 : session.completedPomodoros

    const entry: HistoryEntry = {
      startedAt: session.startedAt,
      endedAt: Date.now(),
      type: session.type,
      label: session.label,
      completed: true,
    }
    state.history.push(entry)

    if (session.manual) {
      state.activeSession = null
      writeState(state)
      notify(`${sessionTypeLabel(session.type)} complete!`, 'Run pomo start when ready.')
      return
    }

    const nextType =
      session.type === 'work' ? getNextBreakType(completedPomodoros, config.pomodorosPerCycle) : 'work'

    state.activeSession = createSession(nextType, config, undefined, completedPomodoros)
    writeState(state)
    notify(`${sessionTypeLabel(session.type)} complete!`, `Starting ${nextType.replace('-', ' ')} now.`)
  }

  process.stdout.write('\x1B[2J\x1B[H')
  process.stdout.write(renderFrame(state, config))
}

function togglePause(): void {
  const state = readState()
  if (!state.activeSession) return

  state.activeSession = isPaused(state.activeSession)
    ? resumeSession(state.activeSession)
    : pauseSession(state.activeSession)

  writeState(state)

  const config = validateConfig({ ...DEFAULT_CONFIG, ...readConfig() })
  process.stdout.write('\x1B[2J\x1B[H')
  process.stdout.write(renderFrame(state, config))
}

export function watchCommand(): void {
  if (process.stdin.isTTY) {
    process.stdout.write('\x1B[?25l') // hide cursor

    const restore = () => {
      process.stdout.write('\x1B[?25h') // show cursor
      process.stdout.write('\n')
    }

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    process.stdin.on('data', (key: string) => {
      if (key === 'q' || key === '\x03') {
        process.stdin.setRawMode(false)
        restore()
        process.exit(0)
      }
      if (key === 'p' || key === ' ') {
        togglePause()
      }
    })

    process.on('exit', restore)
  }

  tick()
  setInterval(tick, 1000)
}
