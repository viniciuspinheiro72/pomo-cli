import { readState } from '../storage/state.js'
import { sessionTypeLabel } from '../domain/session.js'

export function historyCommand(count = 10): void {
  const state = readState()

  if (state.history.length === 0) {
    console.log('No history yet. Complete a session to start building history.')
    return
  }

  const n = isNaN(count) ? 10 : Math.max(1, count)
  const entries = state.history.slice(-n).reverse()
  console.log(`Last ${entries.length} session(s):\n`)

  for (const entry of entries) {
    const date = new Date(entry.startedAt).toLocaleString()
    const type = sessionTypeLabel(entry.type)
    const label = entry.label ? ` — "${entry.label}"` : ''
    const status = entry.completed ? '✅' : '⏹ '
    const minutes = Math.round((entry.endedAt - entry.startedAt) / 60_000)
    console.log(`${status} ${date}  ${type}${label}  (${minutes}m)`)
  }
}
