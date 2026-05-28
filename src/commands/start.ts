import { readState, writeState, readConfig } from '../storage/state.js'
import {
  createSession,
  computeRemaining,
  formatDuration,
  isExpired,
  sessionTypeLabel,
} from '../domain/session.js'
import { DEFAULT_CONFIG, validateConfig } from '../domain/config.js'
import type { HistoryEntry } from '../domain/types.js'

export function startCommand(label?: string): void {
  const state = readState()
  const config = validateConfig({ ...DEFAULT_CONFIG, ...readConfig() })

  if (state.activeSession && !isExpired(state.activeSession)) {
    const remaining = computeRemaining(state.activeSession)
    const type = sessionTypeLabel(state.activeSession.type)
    console.log(`⚠️  ${type} already active — ${formatDuration(remaining)} remaining.`)
    console.log("Run 'pomo stop' to cancel it first.")
    return
  }

  let completedPomodoros = state.activeSession?.completedPomodoros ?? 0

  if (state.activeSession && isExpired(state.activeSession)) {
    if (state.activeSession.type === 'work') completedPomodoros += 1
    const entry: HistoryEntry = {
      startedAt: state.activeSession.startedAt,
      endedAt: Date.now(),
      type: state.activeSession.type,
      label: state.activeSession.label,
      completed: true,
    }
    state.history.push(entry)
  }

  const session = createSession('work', config, label, completedPomodoros)
  state.activeSession = session
  writeState(state)

  const duration = formatDuration(session.durationMs)
  console.log(`🍅 Pomodoro started${label ? ` — "${label}"` : ''}. ${duration} remaining.`)
}
