import type { PomoConfig } from './types.js'

export const DEFAULT_CONFIG: PomoConfig = {
  workDurationMs: 25 * 60 * 1000,
  shortBreakMs: 5 * 60 * 1000,
  longBreakMs: 15 * 60 * 1000,
  pomodorosPerCycle: 4,
}

export function validateConfig(config: Partial<PomoConfig>): PomoConfig {
  const merged = { ...DEFAULT_CONFIG, ...config }
  if (merged.workDurationMs < 60_000) throw new Error('Work duration must be at least 1 minute')
  if (merged.shortBreakMs < 60_000) throw new Error('Short break must be at least 1 minute')
  if (merged.longBreakMs < 60_000) throw new Error('Long break must be at least 1 minute')
  if (merged.pomodorosPerCycle < 1) throw new Error('Pomodoros per cycle must be at least 1')
  return merged
}
