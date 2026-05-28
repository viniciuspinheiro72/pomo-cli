import { readState, writeState } from '../storage/state.js'
import { sessionTypeLabel } from '../domain/session.js'
import type { HistoryEntry } from '../domain/types.js'

export function stopCommand(): void {
  const state = readState()

  if (!state.activeSession) {
    console.log('No active session to stop.')
    return
  }

  const type = sessionTypeLabel(state.activeSession.type)
  const entry: HistoryEntry = {
    startedAt: state.activeSession.startedAt,
    endedAt: Date.now(),
    type: state.activeSession.type,
    label: state.activeSession.label,
    completed: false,
  }

  state.history.push(entry)
  state.activeSession = null
  writeState(state)

  console.log(`⏹  ${type} stopped and logged to history.`)
}
