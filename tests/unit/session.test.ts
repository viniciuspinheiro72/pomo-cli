import { describe, it, expect, vi } from 'vitest'
import {
  computeRemaining,
  isExpired,
  getNextBreakType,
  createSession,
  formatDuration,
  getDurationMs,
  sessionTypeLabel,
} from '../../src/domain/session.js'
import { DEFAULT_CONFIG } from '../../src/domain/config.js'

describe('computeRemaining', () => {
  it('returns ms remaining based on startedAt and durationMs', () => {
    vi.useFakeTimers()
    const session = createSession('work', DEFAULT_CONFIG)
    vi.advanceTimersByTime(30_000)
    expect(computeRemaining(session)).toBe(DEFAULT_CONFIG.workDurationMs - 30_000)
    vi.useRealTimers()
  })
})

describe('isExpired', () => {
  it('returns true when duration has elapsed', () => {
    const session = {
      startedAt: Date.now() - DEFAULT_CONFIG.workDurationMs - 1000,
      type: 'work' as const,
      completedPomodoros: 0,
      durationMs: DEFAULT_CONFIG.workDurationMs,
    }
    expect(isExpired(session)).toBe(true)
  })

  it('returns false when time has not elapsed', () => {
    const session = createSession('work', DEFAULT_CONFIG)
    expect(isExpired(session)).toBe(false)
  })
})

describe('getNextBreakType', () => {
  it('returns long-break when completedPomodoros is a multiple of pomodorosPerCycle', () => {
    expect(getNextBreakType(4, 4)).toBe('long-break')
    expect(getNextBreakType(8, 4)).toBe('long-break')
  })

  it('returns short-break otherwise', () => {
    expect(getNextBreakType(1, 4)).toBe('short-break')
    expect(getNextBreakType(2, 4)).toBe('short-break')
    expect(getNextBreakType(3, 4)).toBe('short-break')
  })
})

describe('formatDuration', () => {
  it('formats ms to MM:SS', () => {
    expect(formatDuration(90_000)).toBe('01:30')
    expect(formatDuration(25 * 60 * 1000)).toBe('25:00')
    expect(formatDuration(0)).toBe('00:00')
  })

  it('clamps negative ms to 00:00', () => {
    expect(formatDuration(-5000)).toBe('00:00')
  })
})

describe('getDurationMs', () => {
  it('returns correct duration per session type', () => {
    expect(getDurationMs('work', DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.workDurationMs)
    expect(getDurationMs('short-break', DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.shortBreakMs)
    expect(getDurationMs('long-break', DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.longBreakMs)
  })
})

describe('sessionTypeLabel', () => {
  it('returns emoji labels', () => {
    expect(sessionTypeLabel('work')).toContain('Pomodoro')
    expect(sessionTypeLabel('short-break')).toContain('Short break')
    expect(sessionTypeLabel('long-break')).toContain('Long break')
  })
})

describe('createSession', () => {
  it('creates a session with correct type, duration, and label', () => {
    const session = createSession('work', DEFAULT_CONFIG, 'Writing tests', 2)
    expect(session.type).toBe('work')
    expect(session.durationMs).toBe(DEFAULT_CONFIG.workDurationMs)
    expect(session.label).toBe('Writing tests')
    expect(session.completedPomodoros).toBe(2)
  })
})
