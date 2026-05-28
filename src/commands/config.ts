import { readConfig, writeConfig } from '../storage/state.js'
import { DEFAULT_CONFIG } from '../domain/config.js'
import type { PomoConfig } from '../domain/types.js'

const CONFIG_KEYS = [
  'workDurationMs',
  'shortBreakMs',
  'longBreakMs',
  'pomodorosPerCycle',
] as const

type ConfigKey = (typeof CONFIG_KEYS)[number]

export function configCommand(key?: string, value?: string): void {
  const config: PomoConfig = { ...DEFAULT_CONFIG, ...readConfig() }

  if (!key) {
    console.log('Current configuration:\n')
    console.log(`  workDurationMs      ${config.workDurationMs}  (${config.workDurationMs / 60_000}m)`)
    console.log(`  shortBreakMs        ${config.shortBreakMs}  (${config.shortBreakMs / 60_000}m)`)
    console.log(`  longBreakMs         ${config.longBreakMs}  (${config.longBreakMs / 60_000}m)`)
    console.log(`  pomodorosPerCycle   ${config.pomodorosPerCycle}`)
    return
  }

  if (!CONFIG_KEYS.includes(key as ConfigKey)) {
    console.error(`Unknown config key: ${key}`)
    console.error(`Valid keys: ${CONFIG_KEYS.join(', ')}`)
    process.exitCode = 1
    return
  }

  if (!value) {
    console.log(`${key} = ${config[key as ConfigKey]}`)
    return
  }

  const numValue = Number(value)
  if (isNaN(numValue) || numValue <= 0) {
    console.error(`Invalid value: ${value} (must be a positive number)`)
    process.exitCode = 1
    return
  }

  const saved = readConfig()
  saved[key as ConfigKey] = numValue
  writeConfig(saved)
  console.log(`✅ ${key} set to ${numValue}`)
}
