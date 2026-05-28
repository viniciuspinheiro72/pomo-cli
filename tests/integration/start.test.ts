import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { startCommand } from '../../src/commands/start.js'
import { readState } from '../../src/storage/state.js'

vi.mock('../../src/notifications/notifier.js', () => ({ notify: vi.fn() }))

let tempDir: string

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'pomo-test-'))
  process.env.POMO_CONFIG_DIR = tempDir
})

afterEach(() => {
  delete process.env.POMO_CONFIG_DIR
  rmSync(tempDir, { recursive: true, force: true })
})

describe('startCommand', () => {
  it('creates an active work session in state', () => {
    startCommand()
    const state = readState()
    expect(state.activeSession).not.toBeNull()
    expect(state.activeSession?.type).toBe('work')
  })

  it('attaches a label when provided', () => {
    startCommand('Writing tests')
    const state = readState()
    expect(state.activeSession?.label).toBe('Writing tests')
  })

  it('warns and does not restart when a session is already active', () => {
    startCommand()
    const before = readState()
    startCommand()
    const after = readState()
    expect(after.activeSession?.startedAt).toBe(before.activeSession?.startedAt)
  })

  it('replaces an expired session and logs it to history', async () => {
    startCommand()
    // Manually expire the session
    const state = readState()
    state.activeSession!.startedAt = Date.now() - state.activeSession!.durationMs - 1000
    const { writeState } = await import('../../src/storage/state.js')
    writeState(state)

    startCommand('Next pomodoro')
    const after = readState()
    expect(after.activeSession?.label).toBe('Next pomodoro')
    expect(after.history).toHaveLength(1)
    expect(after.history[0].completed).toBe(true)
  })
})
