import { createRequire } from 'module'
import { playSound } from './sound.js'

const require = createRequire(import.meta.url)

export function notify(title: string, message: string): void {
  playSound()
  if (process.env.POMO_NO_NOTIFY) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const notifier = require('node-notifier') as { notify: (opts: object) => void }
    notifier.notify({ title, message, sound: false })
  } catch {
    // playSound already handled audio; swallow notifier errors silently
  }
}
