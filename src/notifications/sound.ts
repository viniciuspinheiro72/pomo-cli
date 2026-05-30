import { spawnSync } from 'child_process'

const LINUX_SOUNDS = [
  '/usr/share/sounds/freedesktop/stereo/complete.oga',
  '/usr/share/sounds/freedesktop/stereo/bell.oga',
  '/usr/share/sounds/ubuntu/notifications/Ding.ogg',
]

export function playSound(): void {
  try {
    if (process.platform === 'darwin') {
      spawnSync('afplay', ['/System/Library/Sounds/Glass.aiff'], { timeout: 3000 })
      return
    }
    if (process.platform === 'linux') {
      for (const file of LINUX_SOUNDS) {
        const pa = spawnSync('paplay', [file], { timeout: 3000 })
        if (pa.status === 0) return
        const al = spawnSync('aplay', [file], { timeout: 3000 })
        if (al.status === 0) return
      }
    }
  } catch {
    // fall through to terminal bell
  }
  process.stdout.write('\x07\x07\x07')
}
