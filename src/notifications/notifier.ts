import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export function notify(title: string, message: string): void {
  if (process.env.POMO_NO_NOTIFY) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const notifier = require('node-notifier') as { notify: (opts: object) => void }
    notifier.notify({ title, message, sound: false })
  } catch {
    process.stdout.write('\x07') // terminal bell fallback
  }
}
