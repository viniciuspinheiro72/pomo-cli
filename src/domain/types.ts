export type SessionType = 'work' | 'short-break' | 'long-break'

export interface ActiveSession {
  startedAt: number
  type: SessionType
  label?: string
  completedPomodoros: number
  durationMs: number
}

export interface HistoryEntry {
  startedAt: number
  endedAt: number
  type: SessionType
  label?: string
  completed: boolean
}

export interface PomodoroState {
  activeSession: ActiveSession | null
  history: HistoryEntry[]
}

export interface PomoConfig {
  workDurationMs: number
  shortBreakMs: number
  longBreakMs: number
  pomodorosPerCycle: number
}
