import { describe, it, expect } from 'vitest'
import { renderProgressBar, renderFrame } from '../../src/commands/watch.js'
import { DEFAULT_CONFIG } from '../../src/domain/config.js'
import type { PomodoroState } from '../../src/domain/types.js'

describe('renderProgressBar', () => {
  it('shows empty bar at start (0% elapsed)', () => {
    const bar = renderProgressBar(25 * 60 * 1000, 25 * 60 * 1000)
    expect(bar).toBe('░'.repeat(32))
  })

  it('shows full bar when complete', () => {
    const bar = renderProgressBar(0, 25 * 60 * 1000)
    expect(bar).toBe('█'.repeat(32))
  })

  it('shows half bar at 50% elapsed', () => {
    const total = 25 * 60 * 1000
    const bar = renderProgressBar(total / 2, total)
    expect(bar).toBe('█'.repeat(16) + '░'.repeat(16))
  })

  it('clamps negative remaining to full bar', () => {
    const bar = renderProgressBar(-5000, 25 * 60 * 1000)
    expect(bar).toBe('█'.repeat(32))
  })
})

describe('renderFrame', () => {
  const emptyState: PomodoroState = { activeSession: null, history: [] }

  it('shows idle message when no session is active', () => {
    const frame = renderFrame(emptyState, DEFAULT_CONFIG)
    expect(frame).toContain('No active session')
    expect(frame).toContain('Ctrl+C')
  })

  it('shows session type and time remaining', () => {
    const state: PomodoroState = {
      activeSession: {
        startedAt: Date.now(),
        type: 'work',
        completedPomodoros: 0,
        durationMs: 25 * 60 * 1000,
      },
      history: [],
    }
    const frame = renderFrame(state, DEFAULT_CONFIG)
    expect(frame).toContain('Pomodoro')
    expect(frame).toContain('25:00')
    expect(frame).toContain('Pomodoro 1 of 4')
  })

  it('shows correct pomodoro counter mid-cycle', () => {
    const state: PomodoroState = {
      activeSession: {
        startedAt: Date.now(),
        type: 'work',
        completedPomodoros: 2,
        durationMs: 25 * 60 * 1000,
      },
      history: [],
    }
    const frame = renderFrame(state, DEFAULT_CONFIG)
    expect(frame).toContain('Pomodoro 3 of 4')
  })

  it('shows break label for short-break sessions', () => {
    const state: PomodoroState = {
      activeSession: {
        startedAt: Date.now(),
        type: 'short-break',
        completedPomodoros: 1,
        durationMs: 5 * 60 * 1000,
      },
      history: [],
    }
    const frame = renderFrame(state, DEFAULT_CONFIG)
    expect(frame).toContain('Short break')
  })

  it('shows session label when provided', () => {
    const state: PomodoroState = {
      activeSession: {
        startedAt: Date.now(),
        type: 'work',
        label: 'Deep work',
        completedPomodoros: 0,
        durationMs: 25 * 60 * 1000,
      },
      history: [],
    }
    const frame = renderFrame(state, DEFAULT_CONFIG)
    expect(frame).toContain('"Deep work"')
  })
})
