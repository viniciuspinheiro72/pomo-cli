import { readState, writeState, readConfig } from '../storage/state.js'
import {
  computeRemaining,
  formatDuration,
  isExpired,
  sessionTypeLabel,
  getNextBreakType,
  createSession,
} from '../domain/session.js'
import { DEFAULT_CONFIG, validateConfig } from '../domain/config.js'
import { notify } from '../notifications/notifier.js'
import type { HistoryEntry } from '../domain/types.js'

export function statusCommand(): void {
  const state = readState()

  if (!state.activeSession) {
    console.log("No active session. Run 'pomo start' to begin.")
    return
  }

  const session = state.activeSession
  const config = validateConfig({ ...DEFAULT_CONFIG, ...readConfig() })

  if (isExpired(session)) {
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

    const nextType =
      session.type === 'work'
        ? getNextBreakType(completedPomodoros, config.pomodorosPerCycle)
        : 'work'

    const nextSession = createSession(nextType, config, undefined, completedPomodoros)
    state.activeSession = nextSession
    writeState(state)

    const finished = sessionTypeLabel(session.type)
    const next = sessionTypeLabel(nextType)
    notify(`${finished} complete!`, `Starting ${nextType.replace('-', ' ')} now.`)
    console.log(`✅ ${finished} complete! Starting ${next} — ${formatDuration(nextSession.durationMs)} remaining.`)
    return
  }

  const remaining = computeRemaining(session)
  const type = sessionTypeLabel(session.type)
  const label = session.label ? ` — "${session.label}"` : ''
  console.log(`${type}${label} — ${formatDuration(remaining)} remaining.`)
}
