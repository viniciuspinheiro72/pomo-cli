import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { startCommand } from '../../src/commands/start.js'
import { stopCommand } from '../../src/commands/stop.js'
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

describe('stopCommand', () => {
  it('clears the active session and adds an incomplete entry to history', () => {
    startCommand()
    stopCommand()
    const state = readState()
    expect(state.activeSession).toBeNull()
    expect(state.history).toHaveLength(1)
    expect(state.history[0].completed).toBe(false)
  })

  it('does not throw when no session is active', () => {
    expect(() => stopCommand()).not.toThrow()
    const state = readState()
    expect(state.history).toHaveLength(0)
  })
})
