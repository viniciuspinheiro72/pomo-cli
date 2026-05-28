import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import type { PomodoroState, PomoConfig } from '../domain/types.js'

export function getConfigDir(): string {
  return process.env.POMO_CONFIG_DIR ?? join(homedir(), '.pomo')
}

function getStatePath(): string {
  return join(getConfigDir(), 'state.json')
}

function getConfigPath(): string {
  return join(getConfigDir(), 'config.json')
}

export function ensureConfigDir(): void {
  const dir = getConfigDir()
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

const EMPTY_STATE: PomodoroState = { activeSession: null, history: [] }

export function readState(): PomodoroState {
  ensureConfigDir()
  const path = getStatePath()
  if (!existsSync(path)) return { ...EMPTY_STATE, history: [] }
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as PomodoroState
  } catch {
    return { ...EMPTY_STATE, history: [] }
  }
}

export function writeState(state: PomodoroState): void {
  ensureConfigDir()
  writeFileSync(getStatePath(), JSON.stringify(state, null, 2))
}

export function readConfig(): Partial<PomoConfig> {
  ensureConfigDir()
  const path = getConfigPath()
  if (!existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as Partial<PomoConfig>
  } catch {
    return {}
  }
}

export function writeConfig(config: Partial<PomoConfig>): void {
  ensureConfigDir()
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2))
}
