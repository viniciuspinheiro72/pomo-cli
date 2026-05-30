import type { SessionType, ActiveSession, PomoConfig } from './types.js'

export function getDurationMs(type: SessionType, config: PomoConfig): number {
  switch (type) {
    case 'work': return config.workDurationMs
    case 'short-break': return config.shortBreakMs
    case 'long-break': return config.longBreakMs
  }
}

export function computeRemaining(session: ActiveSession): number {
  const elapsed = session.pausedAt
    ? session.pausedAt - session.startedAt
    : Date.now() - session.startedAt
  return session.durationMs - elapsed
}

export function isExpired(session: ActiveSession): boolean {
  if (session.pausedAt) return false
  return computeRemaining(session) <= 0
}

export function isPaused(session: ActiveSession): boolean {
  return session.pausedAt !== undefined
}

export function pauseSession(session: ActiveSession): ActiveSession {
  if (session.pausedAt) return session
  return { ...session, pausedAt: Date.now() }
}

export function resumeSession(session: ActiveSession): ActiveSession {
  if (!session.pausedAt) return session
  const pausedDuration = Date.now() - session.pausedAt
  const resumed = { ...session, startedAt: session.startedAt + pausedDuration }
  delete resumed.pausedAt
  return resumed
}

/** Returns the break type that follows a completed Pomodoro cycle. */
export function getNextBreakType(completedPomodoros: number, pomodorosPerCycle: number): SessionType {
  return completedPomodoros % pomodorosPerCycle === 0 ? 'long-break' : 'short-break'
}

export function createSession(
  type: SessionType,
  config: PomoConfig,
  label?: string,
  completedPomodoros = 0,
  manual = false,
): ActiveSession {
  return {
    startedAt: Date.now(),
    type,
    label,
    completedPomodoros,
    durationMs: getDurationMs(type, config),
    ...(manual && { manual: true }),
  }
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function sessionTypeLabel(type: SessionType): string {
  switch (type) {
    case 'work': return '🍅 Pomodoro'
    case 'short-break': return '☕ Short break'
    case 'long-break': return '🌴 Long break'
  }
}
