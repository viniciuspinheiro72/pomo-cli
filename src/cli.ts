#!/usr/bin/env node
import { Command } from 'commander'
import { startCommand } from './commands/start.js'
import { stopCommand } from './commands/stop.js'
import { statusCommand } from './commands/status.js'
import { historyCommand } from './commands/history.js'
import { configCommand } from './commands/config.js'
import { watchCommand } from './commands/watch.js'

const program = new Command()

program
  .name('pomo')
  .description('A minimal Pomodoro timer for the terminal')
  .version('0.1.0')

program
  .command('start [label]')
  .description('Start a Pomodoro session')
  .action((label?: string) => startCommand(label))

program
  .command('stop')
  .description('Stop the current session')
  .action(() => stopCommand())

program
  .command('status')
  .description('Show time remaining in the current session')
  .action(() => statusCommand())

program
  .command('history [count]')
  .description('Show recent session history (default: last 10)')
  .action((count?: string) => historyCommand(count ? parseInt(count, 10) : 10))

program
  .command('config [key] [value]')
  .description('Show or set configuration values')
  .action((key?: string, value?: string) => configCommand(key, value))

program
  .command('watch')
  .description('Live display — updates every second, auto-advances on session end')
  .action(() => watchCommand())

program.parse()
